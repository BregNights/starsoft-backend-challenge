import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { SeatFactory } from 'test/factories/make-seat'
import { SessionFactory } from 'test/factories/make-session'
import { DatabaseModule } from '../../database/database.module'

describe('Fetch Seat By Session (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let sessionFactory: SessionFactory
  let seatFactory: SeatFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SessionFactory, SeatFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    sessionFactory = moduleRef.get(SessionFactory)
    seatFactory = moduleRef.get(SeatFactory)
    await app.init()
  })

  it('[GET] /sessions/:id/seats', async () => {
    const session = await sessionFactory.makePrismaSession()

    await seatFactory.makePrismaSeat({
      sessionId: session.id,
      seatNumber: 'A1',
    })

    await seatFactory.makePrismaSeat({
      sessionId: session.id,
      seatNumber: 'A2',
    })

    const response = await request(app.getHttpServer())
      .get(`/sessions/${session.id}/seats`)
      .send({})

    expect(response.statusCode).toBe(200)

    const seatOnDatabase = await prisma.seat.findMany({
      where: {
        sessionId: session.id,
      },
    })

    expect(seatOnDatabase).toBeTruthy()
    expect(seatOnDatabase).toHaveLength(2)
  })
})

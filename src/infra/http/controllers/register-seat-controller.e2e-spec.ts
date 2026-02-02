import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { SessionFactory } from 'test/factories/make-session'
import { DatabaseModule } from '../../database/database.module'

describe('Register Seat (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let sessionFactory: SessionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SessionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    sessionFactory = moduleRef.get(SessionFactory)
    await app.init()
  })

  it('[POST] /seats', async () => {
    const session = await sessionFactory.makePrismaSession()

    const response = await request(app.getHttpServer())
      .post('/seats')
      .send({
        seatNumbers: [
          'A1',
          'A2',
          'A3',
          'A4',
          'B1',
          'B2',
          'B3',
          'B4',
          'D1',
          'D2',
          'D3',
          'D4',
          'C1',
          'C2',
          'C3',
          'C4',
        ],
        sessionId: session.id,
      })

    expect(response.statusCode).toBe(201)

    const seatOnDatabase = await prisma.seat.findMany({
      where: {
        sessionId: session.id,
      },
    })

    expect(seatOnDatabase).toHaveLength(16)
  })
})

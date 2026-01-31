import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { SeatFactory } from 'test/factories/make-seat'
import { SessionFactory } from 'test/factories/make-session'
import { UserFactory } from 'test/factories/make-user'
import { DatabaseModule } from '../../database/database.module'

describe('Create reservation (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let sessionFactory: SessionFactory
  let seatFactory: SeatFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, SessionFactory, SeatFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    sessionFactory = moduleRef.get(SessionFactory)
    seatFactory = moduleRef.get(SeatFactory)
    await app.init()
  })

  it('[POST] /reservations', async () => {
    const user = await userFactory.makePrismaUser()
    const session = await sessionFactory.makePrismaSession()
    const seat = await seatFactory.makePrismaSeat({
      sessionId: session.id,
      seatNumber: `A1`,
    })

    const response = await request(app.getHttpServer())
      .post('/reservations')
      .send({ seatId: seat.id, sessionId: session.id, userId: user.id })

    expect(response.statusCode).toBe(201)

    const reservationOnDatabase = await prisma.reservation.findUnique({
      where: {
        seatId: seat.id,
      },
    })

    expect(reservationOnDatabase).toBeTruthy()
  })
})

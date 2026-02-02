import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { SeatFactory } from 'test/factories/make-seat'
import { SessionFactory } from 'test/factories/make-session'
import { UserFactory } from 'test/factories/make-user'
import { DatabaseModule } from '../../database/database.module'

describe('Fetch Purchase History By User (E2E)', () => {
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

  it('[GET] /users/:id/purchases', async () => {
    const user = await userFactory.makePrismaUser()
    const session = await sessionFactory.makePrismaSession()
    const seat = await seatFactory.makePrismaSeat({
      sessionId: session.id,
      seatNumber: 'A1',
    })

    const createReservationResponse = await request(app.getHttpServer())
      .post('/reservations')
      .send({ seatId: seat.id, sessionId: session.id, userId: user.id })

    await request(app.getHttpServer()).post('/reservations/confirm').send({
      reservationId: createReservationResponse.body.id,
      userId: user.id,
    })

    const response = await request(app.getHttpServer()).get(
      `/users/${user.id}/purchases`,
    )

    expect(response.statusCode).toBe(200)
    expect(response.body.purchases).toHaveLength(1)

    const purchasesOnDatabase = await prisma.reservation.findMany({
      where: {
        userId: user.id,
        status: 'CONFIRMED',
      },
    })

    expect(purchasesOnDatabase).toHaveLength(1)
  })
})

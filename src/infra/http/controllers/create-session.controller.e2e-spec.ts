import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '../../database/database.module'

describe('Create Session (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  it('[POST] /sessions', async () => {
    const startsAt = new Date()
    startsAt.setMonth(startsAt.getMonth() + 1)

    const response = await request(app.getHttpServer()).post('/sessions').send({
      movieTitle: 'Example',
      price: 28.99,
      room: '1',
      startsAt,
    })

    expect(response.statusCode).toBe(201)

    const sessionOnDatabase = await prisma.session.findFirst({
      where: {
        id: response.body.id,
      },
    })

    expect(sessionOnDatabase).toBeTruthy()
  })
})

import { User } from '@/domain/cine/application/repositories/users-repository'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<User> = {}): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      ...data,
    }

    await this.prisma.user.create({
      data: user,
    })

    return user
  }
}

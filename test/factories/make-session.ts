import { Session } from '@/domain/cine/application/repositories/session-repository'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'

@Injectable()
export class SessionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaSession(data: Partial<Session> = {}): Promise<Session> {
    const session: Session = {
      id: randomUUID(),
      movieTitle: 'Test Movie',
      room: 'Room 1',
      startsAt: new Date(),
      price: 15.0,
      ...data,
    }

    await this.prisma.session.create({
      data: session,
    })

    return session
  }
}

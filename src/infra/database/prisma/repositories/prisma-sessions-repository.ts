import {
  Session,
  SessionsRepository,
} from '@/domain/cine/application/repositories/session-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaSessionsRepository implements SessionsRepository {
  constructor(private prisma: PrismaService) {}

  async create(session: Session): Promise<void> {
    await this.prisma.session.create({
      data: {
        movieTitle: session.movieTitle,
        room: session.room,
        startsAt: session.startsAt,
        price: session.price,
      },
    })
  }

  async findById(id: string): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({
      where: { id },
    })

    return session ? { ...session, price: session.price.toNumber() } : null
  }
}

import {
  Seat,
  SeatsRepository,
} from '@/domain/cine/application/repositories/seat-respository'
import { Injectable } from '@nestjs/common'
import { SeatStatus } from 'generated/prisma/enums'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaSeatsRepository implements SeatsRepository {
  constructor(private prisma: PrismaService) {}

  async create(seat: Seat): Promise<void> {
    await this.prisma.seat.create({
      data: {
        seatNumber: seat.seatNumber,
        sessionId: seat.sessionId,
        status: SeatStatus.AVAILABLE ?? seat.status,
      },
    })
  }

  async findById(id: string): Promise<Seat | null> {
    const session = await this.prisma.seat.findUnique({
      where: { id },
    })

    return session ?? null
  }

  async findBySessionId(sessionId: string): Promise<Seat | null> {
    const session = await this.prisma.seat.findFirst({
      where: { sessionId: sessionId },
    })

    return session ?? null
  }

  async findManySeatsBySessionId(sessionId: string): Promise<Seat[]> {
    const session = await this.prisma.seat.findMany({
      where: { sessionId: sessionId },
    })

    return session ?? null
  }
}

import {
  Seat,
  SeatsRepository,
  SeatStatus,
} from '@/domain/cine/application/repositories/seat-respository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaSeatsRepository implements SeatsRepository {
  constructor(private prisma: PrismaService) {}

  async create(seat: Seat): Promise<void> {
    await this.prisma.seat.create({
      data: {
        seatNumber: seat.seatNumber,
        sessionId: seat.sessionId,
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

  async reserve(seatId: string): Promise<boolean> {
    const result = await this.prisma.seat.updateMany({
      where: {
        id: seatId,
        status: 'AVAILABLE',
      },
      data: {
        status: 'RESERVED',
      },
    })

    return result.count === 1
  }

  async markAsSold(id: string, status: SeatStatus): Promise<void> {
    await this.prisma.seat.update({
      where: { id },
      data: { status },
    })
  }
}

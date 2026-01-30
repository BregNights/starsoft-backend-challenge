import { Seat } from '@/domain/cine/application/repositories/seat-respository'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { SeatStatus } from 'generated/prisma/enums'
import { randomUUID } from 'node:crypto'

@Injectable()
export class SeatFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaSeat(data: Partial<Seat> = {}): Promise<Seat> {
    const seat: Seat = {
      seatNumber: 'A1',
      sessionId: randomUUID(),
      status: SeatStatus.AVAILABLE,
      id: randomUUID(),
      ...data,
    }

    await this.prisma.seat.create({
      data: seat,
    })

    return seat
  }
}

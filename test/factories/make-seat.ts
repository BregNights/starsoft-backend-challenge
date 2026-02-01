import { Seat } from '@/domain/cine/application/repositories/seat-respository'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { SeatStatus } from 'generated/prisma/enums'
import { randomUUID } from 'node:crypto'

export function makeSeat(override: Partial<Seat> = {}): Seat {
  return {
    id: randomUUID(),
    seatNumber: 'A1',
    status: 'AVAILABLE',
    sessionId: randomUUID(),
    ...override,
  }
}

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

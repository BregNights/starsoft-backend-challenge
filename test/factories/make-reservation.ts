import { Reservation } from '@/domain/cine/application/repositories/reservation-repository'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { ReservationStatus } from 'generated/prisma/enums'
import { randomUUID } from 'node:crypto'

export function makeReservation(
  override: Partial<Reservation> = {},
): Reservation {
  return {
    id: randomUUID(),
    userId: randomUUID(),
    seatId: randomUUID(),
    status: 'ACTIVE',
    expiresAt: new Date(Date.now() + 30_000),
    createdAt: new Date(),
    ...override,
  }
}

@Injectable()
export class ReservationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaSeat(data: Partial<Reservation> = {}): Promise<Reservation> {
    const reservation: Reservation = {
      id: randomUUID(),
      userId: randomUUID(),
      seatId: randomUUID(),
      status: ReservationStatus.ACTIVE,
      expiresAt: new Date(Date.now() + 30_000),
      createdAt: new Date(),
      ...data,
    }

    await this.prisma.reservation.create({
      data: reservation,
    })

    return reservation
  }
}

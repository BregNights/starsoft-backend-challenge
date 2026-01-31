import {
  Reservation,
  ReservationsRepository,
} from '@/domain/cine/application/repositories/reservation-repository'
import { Injectable } from '@nestjs/common'
import { ReservationStatus } from 'generated/prisma/enums'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaReservationsRepository implements ReservationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(reservation: Reservation): Promise<void> {
    await this.prisma.reservation.create({
      data: {
        userId: reservation.userId,
        seatId: reservation.seatId,
        expiresAt: reservation.expiresAt,
        status: ReservationStatus.ACTIVE ?? reservation.status,
      },
    })
  }

  async findBySeatId(seatId: string): Promise<Reservation | null> {
    const reservationSeat = await this.prisma.reservation.findUnique({
      where: { seatId },
    })

    return reservationSeat ?? null
  }
}

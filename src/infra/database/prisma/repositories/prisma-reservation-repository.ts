import {
  Reservation,
  ReservationsRepository,
  ReservationStatus,
} from '@/domain/cine/application/repositories/reservation-repository'
import { SeatAlreadyReservedError } from '@/domain/cine/application/use-cases/errors/seat-already-reserved.error'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaReservationsRepository implements ReservationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(reservation: Reservation): Promise<Reservation> {
    try {
      const createReservation = await this.prisma.reservation.create({
        data: {
          userId: reservation.userId,
          seatId: reservation.seatId,
          status: reservation.status,
          expiresAt: reservation.expiresAt,
        },
      })

      return createReservation
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new SeatAlreadyReservedError()
      }
      throw error
    }
  }

  async findById(id: string): Promise<Reservation | null> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    })

    return reservation ?? null
  }

  async findBySeatId(seatId: string): Promise<Reservation | null> {
    const reservationSeat = await this.prisma.reservation.findFirst({
      where: { seatId },
    })

    return reservationSeat ?? null
  }

  async updateStatus(id: string, status: ReservationStatus): Promise<void> {
    await this.prisma.reservation.update({
      where: { id },
      data: { status },
    })
  }

  async findManyExpired(now: Date): Promise<Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          lt: now,
        },
      },
    })

    return reservations
  }

  async expire(reservationId: string): Promise<void> {
    await this.prisma.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        status: 'EXPIRED',
      },
    })
  }
}

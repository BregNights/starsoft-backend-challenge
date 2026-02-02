import {
  Reservation,
  ReservationsRepository,
  ReservationStatus,
} from '@/domain/cine/application/repositories/reservation-repository'
import { SeatAlreadyReservedError } from '@/domain/cine/application/use-cases/errors/seat-already-reserved.error'

export class InMemoryReservationsRepository implements ReservationsRepository {
  public items: Reservation[] = []

  async create(reservation: Reservation): Promise<Reservation> {
    const seatAlreadyReserved = this.items.find(
      (item) =>
        item.seatId === reservation.seatId &&
        item.status === reservation.status &&
        item.expiresAt > new Date(),
    )

    if (seatAlreadyReserved) {
      throw new SeatAlreadyReservedError()
    }

    this.items.push(reservation)
    return reservation
  }

  async findById(id: string): Promise<Reservation | null> {
    const reservation = this.items.find((item) => item.id === id)

    return reservation || null
  }

  async findBySeatId(seatId: string): Promise<Reservation | null> {
    const reservationSeat = this.items.find((item) => item.seatId === seatId)

    return reservationSeat || null
  }

  async findManyConfirmedByUserId(userId: string): Promise<Reservation[]> {
    return this.items.filter(
      (item) => item.userId === userId && item.status === 'CONFIRMED',
    )
  }

  async updateStatus(id: string, status: ReservationStatus): Promise<void> {
    const reservation = this.items.find((item) => item.id === id)

    if (!reservation) return

    reservation.status = status
  }

  async findManyExpired(now: Date): Promise<Reservation[]> {
    return this.items.filter(
      (reservation) =>
        reservation.status === 'ACTIVE' && reservation.expiresAt < now,
    )
  }

  async expire(reservationId: string): Promise<void> {
    const reservation = this.items.find((item) => item.id === reservationId)

    if (!reservation) return

    reservation.status = 'EXPIRED'
  }
}

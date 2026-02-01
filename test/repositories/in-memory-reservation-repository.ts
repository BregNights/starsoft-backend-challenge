import {
  Reservation,
  ReservationsRepository,
} from '@/domain/cine/application/repositories/reservation-repository'
import { SeatAlreadyReservedError } from '@/domain/cine/application/use-cases/errors/seat-already-reserved.error'

export class InMemoryReservationsRepository implements ReservationsRepository {
  public items: Reservation[] = []

  async create(reservation: Reservation): Promise<void> {
    const seatAlreadyReserved = this.items.find(
      (item) =>
        item.seatId === reservation.seatId &&
        item.status === 'ACTIVE' &&
        item.expiresAt > new Date(),
    )

    if (seatAlreadyReserved) {
      throw new SeatAlreadyReservedError()
    }

    this.items.push(reservation)
  }

  async findBySeatId(seatId: string): Promise<Reservation | null> {
    const reservationSeat = this.items.find((item) => item.seatId === seatId)

    return reservationSeat || null
  }
}

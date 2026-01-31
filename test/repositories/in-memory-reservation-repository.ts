import {
  Reservation,
  ReservationsRepository,
} from '@/domain/cine/application/repositories/reservation-repository'

export class InMemoryReservationsRepository implements ReservationsRepository {
  public items: Reservation[] = []

  async create(reservation: Reservation): Promise<void> {
    this.items.push(reservation)
  }

  async findBySeatId(seatId: string): Promise<Reservation | null> {
    const reservationSeat = this.items.find((item) => item.seatId === seatId)

    return reservationSeat || null
  }
}

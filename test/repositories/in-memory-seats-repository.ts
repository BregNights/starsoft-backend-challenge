import {
  Seat,
  SeatsRepository,
  SeatStatus,
} from '@/domain/cine/application/repositories/seat-respository'

export class InMemorySeatsRepository implements SeatsRepository {
  public items: Seat[] = []

  async create(seat: Seat): Promise<void> {
    this.items.push(seat)
  }

  async findById(id: string): Promise<Seat | null> {
    const session = this.items.find((item) => item.id === id)

    return session || null
  }

  async findBySessionId(sessionId: string): Promise<Seat | null> {
    const session = this.items.find((item) => item.sessionId === sessionId)

    return session || null
  }

  async findManySeatsBySessionId(sessionId: string): Promise<Seat[]> {
    const seats = this.items.filter((item) => item.sessionId === sessionId)

    return seats
  }

  async reserve(seatId: string): Promise<boolean> {
    const seat = this.items.find((item) => item.id === seatId)

    if (!seat) {
      return false
    }

    if (seat.status !== 'AVAILABLE') {
      return false
    }

    seat.status = 'RESERVED'
    return true
  }

  async markAsSold(seatId: string, status: SeatStatus): Promise<void> {
    const seat = this.items.find((item) => item.id === seatId)

    if (!seat) return

    seat.status = status
  }
}

import {
  Seat,
  SeatsRepository,
} from '@/domain/cine/application/repositories/seat-respository'

export class InMemorySeatsRepository implements SeatsRepository {
  public items: Seat[] = []

  async create(Seat: Seat): Promise<void> {
    this.items.push(Seat)
  }

  async findBySessionId(sessionId: string): Promise<Seat | null> {
    const session = this.items.find((item) => item.sessionId === sessionId)

    return session || null
  }

  async findManySeatsBySessionId(sessionId: string): Promise<Seat[]> {
    const seats = this.items.filter((item) => item.id === sessionId)

    return seats
  }
}

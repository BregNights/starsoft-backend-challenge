import { ReservationExpirationRepository } from '@/infra/redis/reservation-expiration-repository'

export class InMemoryReservationExpirationRepository
  implements ReservationExpirationRepository
{
  public items = new Set<string>()

  async save(reservationId: string, _ttl: number): Promise<void> {
    this.items.add(reservationId)
  }

  async exists(reservationId: string): Promise<boolean> {
    return this.items.has(reservationId)
  }

  async remove(reservationId: string): Promise<void> {
    this.items.delete(reservationId)
  }
}

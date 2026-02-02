export abstract class ReservationExpirationRepository {
  abstract save(reservationId: string, ttl: number): Promise<void>
  abstract exists(reservationId: string): Promise<boolean>
  abstract remove(reservationId: string): Promise<void>
}

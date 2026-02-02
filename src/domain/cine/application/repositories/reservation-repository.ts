export type ReservationStatus = 'ACTIVE' | 'EXPIRED' | 'CONFIRMED'

export interface Reservation {
  id?: string
  userId: string
  seatId: string
  status: ReservationStatus
  expiresAt: Date
  createdAt?: Date
}

export abstract class ReservationsRepository {
  abstract create(reservation: Reservation): Promise<Reservation>
  abstract findById(id: string): Promise<Reservation | null>
  abstract findBySeatId(seatId: string): Promise<Reservation | null>
  abstract findManyConfirmedByUserId(userId: string): Promise<Reservation[]>
  abstract updateStatus(id: string, status: ReservationStatus): Promise<void>
  abstract findManyExpired(now: Date): Promise<Reservation[]>
  abstract expire(reservationId: string): Promise<void>
}

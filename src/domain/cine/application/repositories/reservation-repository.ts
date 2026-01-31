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
  abstract create(reservation: Reservation): Promise<void>
  abstract findBySeatId(seatId: string): Promise<Reservation | null>
}

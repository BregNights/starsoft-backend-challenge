export type SeatStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD'

export interface Seat {
  id?: string
  seatNumber: string
  status?: SeatStatus
  sessionId: string
  createdAt?: Date
}

export abstract class SeatsRepository {
  abstract create(seat: Seat): Promise<void>
  abstract findById(id: string): Promise<Seat | null>
  abstract findBySessionId(sessionId: string): Promise<Seat | null>
  abstract findManySeatsBySessionId(sessionId: string): Promise<Seat[]>
  abstract reserve(seatId: string): Promise<boolean>
  abstract markAsSold(seatId: string, status: SeatStatus): Promise<void>
  abstract markAsAvailable(seatId: string): Promise<void>
}

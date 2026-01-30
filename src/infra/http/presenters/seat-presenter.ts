import { Seat } from '@/domain/cine/application/repositories/seat-respository'

export class SeatPresenter {
  static toHTTP(seat: Seat) {
    return {
      id: seat.id,
      seatNumber: seat.seatNumber,
      status: seat.status,
      sessionId: seat.sessionId,
    }
  }
}

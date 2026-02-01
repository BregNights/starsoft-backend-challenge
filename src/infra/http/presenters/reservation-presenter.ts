import { Reservation } from '@/domain/cine/application/repositories/reservation-repository'

export class ReservationPresenter {
  static toHTTP(reservation: Reservation) {
    return {
      id: reservation.id,
      expiresAt: reservation.expiresAt,
    }
  }
}

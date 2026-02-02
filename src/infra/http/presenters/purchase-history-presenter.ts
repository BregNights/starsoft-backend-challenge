import { Reservation } from '@/domain/cine/application/repositories/reservation-repository'

export class PurchaseHistoryPresenter {
  static toHTTP(reservation: Reservation) {
    return {
      reservationId: reservation.id,
      seatId: reservation.seatId,
      status: reservation.status,
      purchasedAt: reservation.createdAt,
    }
  }
}

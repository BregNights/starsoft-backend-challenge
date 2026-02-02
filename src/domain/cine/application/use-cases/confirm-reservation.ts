import { Either, left, right } from '@/core/either'
import { ReservationExpirationRepository } from '@/infra/redis/reservation-expiration-repository'
import { Injectable } from '@nestjs/common'
import { ReservationsRepository } from '../repositories/reservation-repository'
import { SeatsRepository } from '../repositories/seat-respository'
import { InvalidReservationStatusError } from './errors/invalid-reservation-status.error'
import { PermissionRefusedError } from './errors/permission-refused.error'
import { ReservationExpiredError } from './errors/reservation-expired.error'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

interface ConfirmReservationUseCaseRequest {
  reservationId: string
  userId: string
}

type ConfirmReservationUseCaseResponse = Either<
  | ResourceNotFoundError
  | PermissionRefusedError
  | InvalidReservationStatusError
  | ReservationExpiredError,
  null
>

@Injectable()
export class ConfirmReservationUseCase {
  constructor(
    private reservationsRepository: ReservationsRepository,
    private seatsRepository: SeatsRepository,
    private reservationExpirationRepository: ReservationExpirationRepository,
  ) {}
  async execute({
    reservationId,
    userId,
  }: ConfirmReservationUseCaseRequest): Promise<ConfirmReservationUseCaseResponse> {
    const reservation =
      await this.reservationsRepository.findById(reservationId)
    if (!reservation) return left(new ResourceNotFoundError())

    if (reservation.userId !== userId) return left(new PermissionRefusedError())

    if (reservation.status !== 'ACTIVE')
      return left(new InvalidReservationStatusError())

    const reservationStillActive =
      await this.reservationExpirationRepository.exists(reservationId)

    if (!reservationStillActive) {
      return left(new ReservationExpiredError())
    }

    const now = new Date()
    if (reservation.expiresAt < now) return left(new ReservationExpiredError())

    await this.reservationsRepository.updateStatus(reservationId, 'CONFIRMED')
    await this.seatsRepository.markAsSold(reservation.seatId, 'SOLD')
    await this.reservationExpirationRepository.remove(reservationId)

    return right(null)
  }
}

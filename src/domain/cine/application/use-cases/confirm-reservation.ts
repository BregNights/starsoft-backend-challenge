import { Either, left, right } from '@/core/either'
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
  ) {}
  async execute({
    reservationId,
    userId,
  }: ConfirmReservationUseCaseRequest): Promise<ConfirmReservationUseCaseResponse> {
    const reservation =
      await this.reservationsRepository.findById(reservationId)
    if (!reservation) return left(new ResourceNotFoundError())

    if (reservation.userId !== userId) return left(new PermissionRefusedError())
    console.log(reservation.status)
    if (reservation.status !== 'ACTIVE')
      return left(new InvalidReservationStatusError())

    const now = new Date()
    if (reservation.expiresAt < now) return left(new ReservationExpiredError())

    await this.reservationsRepository.updateStatus(reservationId, 'CONFIRMED')

    await this.seatsRepository.markAsSold(reservation.seatId, 'SOLD')

    return right(null)
  }
}

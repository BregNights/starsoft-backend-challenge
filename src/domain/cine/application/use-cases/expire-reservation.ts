import { Either, left, right } from '@/core/either'
import { ReservationExpirationRepository } from '@/infra/redis/reservation-expiration-repository'
import { Injectable } from '@nestjs/common'
import { ReservationsRepository } from '../repositories/reservation-repository'
import { SeatsRepository } from '../repositories/seat-respository'
import { InvalidReservationStatusError } from './errors/invalid-reservation-status.error'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

interface ExpireReservationUseCaseRequest {
  reservationId: string
}

type ExpireReservationUseCaseResponse = Either<
  ResourceNotFoundError | InvalidReservationStatusError,
  null
>

@Injectable()
export class ExpireReservationUseCase {
  constructor(
    private reservationsRepository: ReservationsRepository,
    private seatsRepository: SeatsRepository,
    private reservationExpirationRepository: ReservationExpirationRepository,
  ) {}

  async execute({
    reservationId,
  }: ExpireReservationUseCaseRequest): Promise<ExpireReservationUseCaseResponse> {
    const reservation =
      await this.reservationsRepository.findById(reservationId)

    if (!reservation) return left(new ResourceNotFoundError())
    if (reservation.status !== 'ACTIVE') {
      return left(new InvalidReservationStatusError())
    }

    await this.reservationsRepository.expire(reservationId)
    await this.seatsRepository.markAsAvailable(reservation.seatId)
    await this.reservationExpirationRepository.remove(reservationId)

    return right(null)
  }
}

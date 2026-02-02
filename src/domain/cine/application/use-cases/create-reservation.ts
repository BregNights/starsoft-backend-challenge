import { Either, left, right } from '@/core/either'
import { ReservationExpirationRepository } from '@/infra/redis/reservation-expiration-repository'
import { Injectable } from '@nestjs/common'
import {
  Reservation,
  ReservationsRepository,
} from '../repositories/reservation-repository'
import { SeatsRepository } from '../repositories/seat-respository'
import { SessionsRepository } from '../repositories/session-repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { SeatAlreadyReservedError } from './errors/seat-already-reserved.error'

interface CreateReservationUseCaseRequest {
  userId: string
  sessionId: string
  seatId: string
}

type CreateReservationUseCaseResponse = Either<
  SeatAlreadyReservedError | ResourceNotFoundError,
  {
    reservation: Reservation
  }
>

@Injectable()
export class CreateReservationUseCase {
  constructor(
    private reservationsRepository: ReservationsRepository,
    private seatsRepository: SeatsRepository,
    private sessionsRepository: SessionsRepository,
    private reservationExpirationRepository: ReservationExpirationRepository,
  ) {}

  async execute({
    userId,
    sessionId,
    seatId,
  }: CreateReservationUseCaseRequest): Promise<CreateReservationUseCaseResponse> {
    const session = await this.sessionsRepository.findById(sessionId)
    if (!session) {
      return left(new ResourceNotFoundError())
    }

    const seat = await this.seatsRepository.findById(seatId)
    if (!seat || seat.sessionId !== sessionId) {
      return left(new ResourceNotFoundError())
    }

    const seatReserved = await this.seatsRepository.reserve(seatId)

    if (!seatReserved) {
      return left(new SeatAlreadyReservedError())
    }

    const expiresAt = new Date(Date.now() + 30_000)

    try {
      const reservation = await this.reservationsRepository.create({
        userId,
        seatId,
        status: 'ACTIVE',
        expiresAt,
      })

      if (reservation.id) {
        await this.reservationExpirationRepository.save(reservation.id, 30)
      }

      return right({ reservation })
    } catch (error) {
      if (error instanceof SeatAlreadyReservedError) {
        return left(error)
      }
      throw error
    }
  }
}

import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ReservationStatus } from 'generated/prisma/enums'
import { ReservationsRepository } from '../repositories/reservation-repository'
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
  null
>

@Injectable()
export class CreateReservationUseCase {
  constructor(
    private reservationsRepository: ReservationsRepository,
    private seatsRepository: SeatsRepository,
    private sessionsRepository: SessionsRepository,
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

    const seatAlreadyReserved =
      await this.reservationsRepository.findBySeatId(seatId)

    if (seatAlreadyReserved) {
      return left(new SeatAlreadyReservedError())
    }

    const expiresAt = new Date(Date.now() + 30_000)
    await this.reservationsRepository.create({
      userId,
      seatId,
      status: ReservationStatus.ACTIVE,
      expiresAt,
    })

    return right(null)
  }
}

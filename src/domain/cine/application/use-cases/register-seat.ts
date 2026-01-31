import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { SeatsRepository } from '../repositories/seat-respository'
import { SessionsRepository } from '../repositories/session-repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { SeatNumberAlreadyExistsSeatsError } from './errors/seat-number-already-exists.error'

interface RegisterSeatUseCaseRequest {
  seatNumber: string
  sessionId: string
}

type RegisterSeatUseCaseResponse = Either<
  ResourceNotFoundError | SeatNumberAlreadyExistsSeatsError,
  null
>

@Injectable()
export class RegisterSeatUseCase {
  constructor(
    private seatsRepository: SeatsRepository,
    private sessionsRepository: SessionsRepository,
  ) {}
  async execute({
    seatNumber,
    sessionId,
  }: RegisterSeatUseCaseRequest): Promise<RegisterSeatUseCaseResponse> {
    const session = await this.sessionsRepository.findById(sessionId)
    if (!session) return left(new ResourceNotFoundError())

    const seat = await this.seatsRepository.findManySeatsBySessionId(sessionId)
    const seatWithSameNumber = seat.find(
      (seat) => seat.seatNumber === seatNumber,
    )
    if (seatWithSameNumber) return left(new SeatNumberAlreadyExistsSeatsError())

    await this.seatsRepository.create({
      seatNumber,
      sessionId,
    })

    return right(null)
  }
}

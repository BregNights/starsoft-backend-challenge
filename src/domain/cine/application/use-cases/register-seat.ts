import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { SeatsRepository } from '../repositories/seat-respository'
import { SessionsRepository } from '../repositories/session-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { SessionAlreadyExistsSeatsError } from './errors/session-already-exists-seats-error'

interface RegisterSeatUseCaseRequest {
  seatNumber: string
  sessionId: string
}

type RegisterSeatUseCaseResponse = Either<
  ResourceNotFoundError | SessionAlreadyExistsSeatsError,
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

    await this.seatsRepository.create({
      seatNumber,
      sessionId,
    })

    return right(null)
  }
}

import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Seat, SeatsRepository } from '../repositories/seat-respository'
import { SessionsRepository } from '../repositories/session-repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

interface FetchSeatBySessionUseCaseRequest {
  sessionId: string
}

type FetchSeatBySessionUseCaseResponse = Either<
  ResourceNotFoundError,
  { seat: Seat[] }
>

@Injectable()
export class FetchSeatBySessionUseCase {
  constructor(
    private seatsRepository: SeatsRepository,
    private sessionsRepository: SessionsRepository,
  ) {}
  async execute({
    sessionId,
  }: FetchSeatBySessionUseCaseRequest): Promise<FetchSeatBySessionUseCaseResponse> {
    const session = await this.sessionsRepository.findById(sessionId)
    if (!session) return left(new ResourceNotFoundError())

    const seat = await this.seatsRepository.findManySeatsBySessionId(sessionId)

    return right({ seat })
  }
}

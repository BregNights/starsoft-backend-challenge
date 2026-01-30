import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { SessionsRepository } from '../repositories/session-repository'
import { InvalidSessionPrice } from './errors/invalid-session-price.error'
import { SessionInPastError } from './errors/session-in-past-error'

interface CreateSessionUseCaseRequest {
  movieTitle: string
  room: string
  startsAt: Date
  price: number
}

type CreateSessionUseCaseResponse = Either<
  SessionInPastError | InvalidSessionPrice,
  null
>

@Injectable()
export class CreateSessionUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}
  async execute({
    movieTitle,
    room,
    startsAt,
    price,
  }: CreateSessionUseCaseRequest): Promise<CreateSessionUseCaseResponse> {
    if (startsAt <= new Date()) {
      return left(new SessionInPastError())
    }

    if (price <= 0) {
      return left(new InvalidSessionPrice())
    }

    await this.sessionsRepository.create({
      movieTitle,
      room,
      startsAt,
      price,
    })

    return right(null)
  }
}

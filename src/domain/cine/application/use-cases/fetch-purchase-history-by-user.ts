import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import {
  Reservation,
  ReservationsRepository,
} from '../repositories/reservation-repository'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

interface FetchPurchaseHistoryByUserUseCaseRequest {
  userId: string
}

type FetchPurchaseHistoryByUserUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    purchases: Reservation[]
  }
>

@Injectable()
export class FetchPurchaseHistoryByUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private reservationsRepository: ReservationsRepository,
  ) {}

  async execute({
    userId,
  }: FetchPurchaseHistoryByUserUseCaseRequest): Promise<FetchPurchaseHistoryByUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const purchases =
      await this.reservationsRepository.findManyConfirmedByUserId(userId)

    return right({ purchases })
  }
}

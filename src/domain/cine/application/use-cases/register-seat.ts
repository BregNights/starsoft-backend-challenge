import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { SeatsRepository } from '../repositories/seat-respository'
import { SessionsRepository } from '../repositories/session-repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { SeatNumberAlreadyExistsSeatsError } from './errors/seat-number-already-exists.error'

interface RegisterSeatUseCaseRequest {
  seatNumbers: string[]
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
    seatNumbers,
    sessionId,
  }: RegisterSeatUseCaseRequest): Promise<RegisterSeatUseCaseResponse> {
    const session = await this.sessionsRepository.findById(sessionId)
    if (!session) return left(new ResourceNotFoundError())

    const seats = await this.seatsRepository.findManySeatsBySessionId(sessionId)
    const existingSeatNumbers = new Set(seats.map((seat) => seat.seatNumber))
    const hasDuplicateSeat = new Set(seatNumbers).size !== seatNumbers.length
    const seatWithSameNumber = seatNumbers.find((seatNumber) =>
      existingSeatNumbers.has(seatNumber),
    )
    if (hasDuplicateSeat || seatWithSameNumber) {
      return left(new SeatNumberAlreadyExistsSeatsError())
    }

    await Promise.all(
      seatNumbers.map((seatNumber) =>
        this.seatsRepository.create({
          seatNumber,
          sessionId,
          status: 'AVAILABLE',
        }),
      ),
    )

    return right(null)
  }
}

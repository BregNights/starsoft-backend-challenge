import { makeSeat } from 'test/factories/make-seat'
import { makeSession } from 'test/factories/make-session'
import { makeUser } from 'test/factories/make-user'
import { InMemoryReservationExpirationRepository } from 'test/repositories/in-memory-reservation-expiration-repository'
import { InMemoryReservationsRepository } from 'test/repositories/in-memory-reservation-repository'
import { InMemorySeatsRepository } from 'test/repositories/in-memory-seats-repository'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateReservationUseCase } from './create-reservation'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { SeatAlreadyReservedError } from './errors/seat-already-reserved.error'

let inMemoryReservationsRepository: InMemoryReservationsRepository
let inMemorySeatsRepository: InMemorySeatsRepository
let inMemorySessionsRepository: InMemorySessionsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryReservationExpirationRepository: InMemoryReservationExpirationRepository
let sut: CreateReservationUseCase

describe('Create Reservation', () => {
  beforeEach(async () => {
    inMemoryReservationsRepository = new InMemoryReservationsRepository()
    inMemorySeatsRepository = new InMemorySeatsRepository()
    inMemorySessionsRepository = new InMemorySessionsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryReservationExpirationRepository =
      new InMemoryReservationExpirationRepository()

    sut = new CreateReservationUseCase(
      inMemoryReservationsRepository,
      inMemorySeatsRepository,
      inMemorySessionsRepository,
      inMemoryReservationExpirationRepository,
    )

    const user = makeUser({})
    await inMemoryUsersRepository.create(user)

    const session = makeSession({
      id: '1',
    })
    await inMemorySessionsRepository.create(session)

    for (let i = 1; i <= 2; i++) {
      const seat = makeSeat({
        seatNumber: `A${i}`,
        sessionId: '1',
        id: '1',
      })
      await inMemorySeatsRepository.create(seat)
    }
  })

  it('should be able create a new reservation', async () => {
    const result = await sut.execute({
      seatId: '1',
      sessionId: '1',
      userId: '1',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able create a new reservation for a session does not exists', async () => {
    const result = await sut.execute({
      seatId: '1',
      sessionId: '2',
      userId: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able create a new reservation for a seat does not exists', async () => {
    const result = await sut.execute({
      seatId: '2',
      sessionId: '1',
      userId: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able create a new reservation from a seat that not part of the session', async () => {
    const result = await sut.execute({
      seatId: '1',
      sessionId: '2',
      userId: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able create a new reservation that already exists', async () => {
    await sut.execute({
      seatId: '1',
      sessionId: '1',
      userId: '1',
    })

    const result = await sut.execute({
      seatId: '1',
      sessionId: '1',
      userId: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SeatAlreadyReservedError)
  })
})

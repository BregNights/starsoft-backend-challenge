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
let sut: CreateReservationUseCase

describe('Create Reservation', () => {
  beforeEach(async () => {
    inMemoryReservationsRepository = new InMemoryReservationsRepository()
    inMemorySeatsRepository = new InMemorySeatsRepository()
    inMemorySessionsRepository = new InMemorySessionsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new CreateReservationUseCase(
      inMemoryReservationsRepository,
      inMemorySeatsRepository,
      inMemorySessionsRepository,
    )

    await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      id: '1',
    })

    await inMemorySessionsRepository.create({
      id: '1',
      movieTitle: 'Example',
      room: '1',
      price: 10,
      startsAt: new Date(),
    })

    for (let i = 1; i <= 2; i++) {
      await inMemorySeatsRepository.create({
        seatNumber: `A${i}`,
        status: 'AVAILABLE',
        sessionId: '1',
        id: '1',
      })
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

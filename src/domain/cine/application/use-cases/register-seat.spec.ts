import { InMemorySeatsRepository } from 'test/repositories/in-memory-seats-repository'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { RegisterSeatUseCase } from './register-seat'
import { SeatNumberAlreadyExistsSeatsError } from './errors/seat-number-already-exists.error'

let inMemorySeatsRepository: InMemorySeatsRepository
let inMemorySessionsRepository = new InMemorySessionsRepository()
let sut: RegisterSeatUseCase

describe('Register Session', () => {
  beforeEach(async () => {
    inMemorySeatsRepository = new InMemorySeatsRepository()
    inMemorySessionsRepository = new InMemorySessionsRepository()
    sut = new RegisterSeatUseCase(
      inMemorySeatsRepository,
      inMemorySessionsRepository,
    )

    await inMemorySessionsRepository.create({
      id: '1',
      movieTitle: 'Example',
      room: '1',
      price: 10,
      startsAt: new Date(),
    })
  })

  it('should be register a seat for a session', async () => {
    const result = await sut.execute({
      seatNumber: 'A1',
      sessionId: '1',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should be register multiple seats for a session', async () => {
    const result = await sut.execute({
      seatNumber: 'A1',
      sessionId: '1',
    })

    await sut.execute({
      seatNumber: 'A2',
      sessionId: '1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemorySeatsRepository.items).toHaveLength(2)
  })

  it('should not be register a seat wih same number for a session', async () => {
    await inMemorySeatsRepository.create({ seatNumber: 'A1', sessionId: '1' })

    const result = await sut.execute({
      seatNumber: 'A1',
      sessionId: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SeatNumberAlreadyExistsSeatsError)
  })

  it('should not be register a seat for a session that does not exist', async () => {
    const result = await sut.execute({
      seatNumber: 'A1',
      sessionId: '2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

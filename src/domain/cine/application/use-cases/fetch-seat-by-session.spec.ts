import { InMemorySeatsRepository } from 'test/repositories/in-memory-seats-repository'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { FetchSeatBySessionUseCase } from './fetch-seat-by-session'

let inMemorySeatsRepository: InMemorySeatsRepository
let inMemorySessionsRepository = new InMemorySessionsRepository()
let sut: FetchSeatBySessionUseCase

describe('Fetch Seats By Session', () => {
  beforeEach(async () => {
    inMemorySeatsRepository = new InMemorySeatsRepository()
    inMemorySessionsRepository = new InMemorySessionsRepository()
    sut = new FetchSeatBySessionUseCase(
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

    for (let i = 1; i <= 2; i++) {
      await inMemorySeatsRepository.create({
        seatNumber: `A${i}`,
        status: 'AVAILABLE',
        sessionId: '1',
        id: '1',
      })
    }
  })

  it('should be able to fetch seats', async () => {
    const result = await sut.execute({
      sessionId: '1',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.seat).toHaveLength(2)
    }
  })

  it('should not be able to fetch seats for a session that does not exist', async () => {
    const result = await sut.execute({
      sessionId: '2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

import { makeSeat } from 'test/factories/make-seat'
import { makeSession } from 'test/factories/make-session'
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

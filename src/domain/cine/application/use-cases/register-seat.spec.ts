import { InMemorySeatsRepository } from 'test/repositories/in-memory-seats-repository'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'
import { RegisterSeatUseCase } from './register-seat'

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

  it('should register multiple seats for a session', async () => {
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
})

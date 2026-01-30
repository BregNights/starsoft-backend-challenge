import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'
import { CreateSessionUseCase } from './create-session'

let inMemorySessionsRepository: InMemorySessionsRepository
let sut: CreateSessionUseCase

describe('Create Session', () => {
  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository()
    sut = new CreateSessionUseCase(inMemorySessionsRepository)
  })

  it('should be able create a new Session', async () => {
    const startsAt = new Date()
    startsAt.setMonth(startsAt.getMonth() + 1)

    const result = await sut.execute({
      movieTitle: 'Iron Man',
      price: 28.99,
      room: '1',
      startsAt,
    })

    expect(result.isRight()).toBe(true)
  })
})

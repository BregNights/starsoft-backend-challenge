import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'
import { CreateSessionUseCase } from './create-session'
import { InvalidSessionPriceError } from './errors/invalid-session-price.error'
import { SessionInPastError } from './errors/session-in-past.error'

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

  it('should not be able create a new session without price', async () => {
    const startsAt = new Date()
    startsAt.setMonth(startsAt.getMonth() + 1)

    const result = await sut.execute({
      movieTitle: 'Iron Man',
      price: 0,
      room: '1',
      startsAt,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidSessionPriceError)
  })

  it('should not be able create a new session in the past', async () => {
    const startsAt = new Date()
    startsAt.setMonth(startsAt.getMonth() - 1)

    const result = await sut.execute({
      movieTitle: 'Iron Man',
      price: 28.99,
      room: '1',
      startsAt,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SessionInPastError)
  })
})

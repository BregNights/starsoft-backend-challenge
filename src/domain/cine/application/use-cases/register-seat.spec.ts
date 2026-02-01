import { makeSeat } from 'test/factories/make-seat'
import { makeSession } from 'test/factories/make-session'
import { InMemorySeatsRepository } from 'test/repositories/in-memory-seats-repository'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { SeatNumberAlreadyExistsSeatsError } from './errors/seat-number-already-exists.error'
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

    const session = makeSession({
      id: '1',
    })
    await inMemorySessionsRepository.create(session)
  })

  it('should be able register a seat for a session', async () => {
    const result = await sut.execute({
      seatNumber: 'A1',
      sessionId: '1',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able register a seat wih same number for a session', async () => {
    const seat = makeSeat({ seatNumber: 'A1', sessionId: '1' })
    await inMemorySeatsRepository.create(seat)

    const result = await sut.execute({
      seatNumber: 'A1',
      sessionId: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SeatNumberAlreadyExistsSeatsError)
  })

  it('should not be able register a seat for a session that does not exist', async () => {
    const result = await sut.execute({
      seatNumber: 'A1',
      sessionId: '2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

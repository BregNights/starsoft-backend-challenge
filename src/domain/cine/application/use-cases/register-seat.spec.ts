import { InMemorySeatsRepository } from 'test/repositories/in-memory-seats-repository'
import { RegisterSeatUseCase } from './register-seat'

let inMemorySeatsRepository: InMemorySeatsRepository
let sut: RegisterSeatUseCase

describe('Create Courier', () => {
  beforeEach(() => {
    inMemorySeatsRepository = new InMemorySeatsRepository()
    sut = new RegisterSeatUseCase(inMemorySeatsRepository)
  })

  it('should register multiple seats for a session', async () => {
    const result = await sut.execute({
      seatNumber: '16',
      sessionId: '1',
    })

    expect(result.isRight()).toBe(true)
  })
})

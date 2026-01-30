import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateAccountUseCase } from './create-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateAccountUseCase

describe('Create Courier', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new CreateAccountUseCase(inMemoryUsersRepository)
  })

  it('should be able create a new courier', async () => {
    const result = await sut.execute({
      name: 'example',
      email: 'example@example.com',
    })

    expect(result.isRight()).toBe(true)
  })
})

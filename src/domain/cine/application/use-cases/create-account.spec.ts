import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateAccountUseCase } from './create-account'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateAccountUseCase

describe('Create Account', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new CreateAccountUseCase(inMemoryUsersRepository)
  })

  it('should be able create a new account', async () => {
    const result = await sut.execute({
      name: 'example',
      email: 'example@example.com',
    })

    expect(result.isRight()).toBe(true)
  })
})

import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateAccountUseCase } from './create-account'
import { UserAlreadyExistsError } from './errors/user-already-exists.error'

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

  it('should not be able create a new account with same email', async () => {
    await sut.execute({
      name: 'example',
      email: 'example@example.com',
    })

    const result = await sut.execute({
      name: 'example1',
      email: 'example@example.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})

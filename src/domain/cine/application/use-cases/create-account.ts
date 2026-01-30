import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface CreateAccountUseCaseRequest {
  name: string
  email: string
}

type CreateAccountUseCaseResponse = Either<UserAlreadyExistsError, null>

@Injectable()
export class CreateAccountUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute({
    name,
    email,
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    if (userWithSameEmail) return left(new UserAlreadyExistsError(email))

    await this.usersRepository.create({ name, email })

    return right(null)
  }
}

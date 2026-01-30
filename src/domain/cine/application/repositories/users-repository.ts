export interface User {
  id?: string
  name: string
  email: string
  createdAt?: Date
}

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>
  abstract findByEmail(email: string): Promise<User | null>
}

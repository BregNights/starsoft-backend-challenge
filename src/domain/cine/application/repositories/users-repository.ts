export interface User {
  id?: string
  name: string
  email: string
  createdAt?: Date
}

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>
  abstract findById(id: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
}

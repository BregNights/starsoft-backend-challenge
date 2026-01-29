export interface User {
  name: string
  email: string
}

export abstract class UsersRepository {
  abstract create(user: User): Promise<User>
  abstract findByEmail(email: string): Promise<User | null>
}

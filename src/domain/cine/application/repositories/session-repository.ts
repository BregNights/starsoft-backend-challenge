export interface Session {
  id?: string
  movieTitle: string
  room: string
  startsAt: Date
  price: number
  createdAt?: Date
}

export abstract class SessionsRepository {
  abstract create(session: Session): Promise<void>
  abstract findById(id: string): Promise<Session | null>
}

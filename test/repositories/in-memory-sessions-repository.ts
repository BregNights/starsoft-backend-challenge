import {
  Session,
  SessionsRepository,
} from '@/domain/cine/application/repositories/session-repository'

export class InMemorySessionsRepository implements SessionsRepository {
  public items: Session[] = []

  async create(session: Session): Promise<void> {
    this.items.push(session)
  }

  async findById(id: string): Promise<Session | null> {
    const session = this.items.find((item) => item.id === id)

    return session || null
  }
}

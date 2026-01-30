import {
  Session,
  SessionsRepository,
} from '@/domain/cine/application/repositories/session-repository'

export class InMemorySessionsRepository implements SessionsRepository {
  public items: Session[] = []

  async create(session: Session): Promise<void> {
    this.items.push(session)
  }
}

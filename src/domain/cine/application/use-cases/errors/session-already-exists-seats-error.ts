import { UseCaseError } from './use-case-error'

export class SessionAlreadyExistsSeatsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Session already error') //todo
  }
}

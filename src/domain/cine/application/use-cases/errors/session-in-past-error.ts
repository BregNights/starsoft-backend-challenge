import { UseCaseError } from './use-case-error'

export class SessionInPastError extends Error implements UseCaseError {
  constructor() {
    super('Session cannot be created in the past')
  }
}

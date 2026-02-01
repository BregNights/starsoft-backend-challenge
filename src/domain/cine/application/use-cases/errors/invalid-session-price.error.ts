import { UseCaseError } from './use-case.error'

export class InvalidSessionPriceError extends Error implements UseCaseError {
  constructor() {
    super(`price error.`) //todo
  }
}

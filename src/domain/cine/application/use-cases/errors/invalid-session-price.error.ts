import { UseCaseError } from './use-case-error'

export class InvalidSessionPrice extends Error implements UseCaseError {
  constructor() {
    super(`price error.`) //todo
  }
}

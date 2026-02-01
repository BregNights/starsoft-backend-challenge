import { UseCaseError } from './use-case.error'

export class PermissionRefusedError extends Error implements UseCaseError {
  constructor() {
    super(`permission refused error.`) //todo
  }
}

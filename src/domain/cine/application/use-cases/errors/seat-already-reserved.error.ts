import { UseCaseError } from './use-case.error'

export class SeatAlreadyReservedError extends Error implements UseCaseError {
  constructor() {
    super('seat already reserved.') //todo
  }
}

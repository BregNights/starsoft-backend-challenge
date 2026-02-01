import { UseCaseError } from './use-case.error'

export class InvalidReservationStatusError extends Error implements UseCaseError {
  constructor() {
    super('Reservation Status error.') // todo
  }
}

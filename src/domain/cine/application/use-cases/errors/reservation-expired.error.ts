import { UseCaseError } from './use-case.error'

export class ReservationExpiredError extends Error implements UseCaseError {
  constructor() {
    super(`Reservation Expired`) //todo
  }
}

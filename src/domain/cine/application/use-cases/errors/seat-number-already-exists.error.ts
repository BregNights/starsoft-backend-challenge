import { UseCaseError } from './use-case.error'

export class SeatNumberAlreadyExistsSeatsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Seat number already error') //todo
  }
}

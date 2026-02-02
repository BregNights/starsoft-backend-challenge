import { makeReservation } from 'test/factories/make-reservation'
import { makeSeat } from 'test/factories/make-seat'
import { makeSession } from 'test/factories/make-session'
import { makeUser } from 'test/factories/make-user'
import { InMemoryReservationExpirationRepository } from 'test/repositories/in-memory-reservation-expiration-repository'
import { InMemoryReservationsRepository } from 'test/repositories/in-memory-reservation-repository'
import { InMemorySeatsRepository } from 'test/repositories/in-memory-seats-repository'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { ConfirmReservationUseCase } from './confirm-reservation'

let inMemoryReservationsRepository: InMemoryReservationsRepository
let inMemorySeatsRepository: InMemorySeatsRepository
let inMemorySessionsRepository: InMemorySessionsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryReservationExpirationRepository: InMemoryReservationExpirationRepository
let sut: ConfirmReservationUseCase

describe('Confirm Reservation', () => {
  beforeEach(async () => {
    inMemoryReservationsRepository = new InMemoryReservationsRepository()
    inMemorySeatsRepository = new InMemorySeatsRepository()
    inMemorySessionsRepository = new InMemorySessionsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryReservationExpirationRepository =
      new InMemoryReservationExpirationRepository()

    sut = new ConfirmReservationUseCase(
      inMemoryReservationsRepository,
      inMemorySeatsRepository,
      inMemoryReservationExpirationRepository,
    )

    const user = makeUser({ id: '1' })
    await inMemoryUsersRepository.create(user)

    const session = makeSession({
      id: '1',
    })
    await inMemorySessionsRepository.create(session)

    const seat = makeSeat({
      sessionId: '1',
      id: '1',
    })
    await inMemorySeatsRepository.create(seat)

    const reservation = makeReservation({
      seatId: seat.id,
      id: '1',
      userId: user.id,
    })
    await inMemoryReservationsRepository.create(reservation)
    await inMemoryReservationExpirationRepository.save(reservation.id!, 30)
  })

  it('should be able confirm reservation', async () => {
    const result = await sut.execute({
      reservationId: '1',
      userId: '1',
    })

    expect(result.isRight()).toBe(true)
  })
})

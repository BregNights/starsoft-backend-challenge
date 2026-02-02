import { makeReservation } from 'test/factories/make-reservation'
import { makeSeat } from 'test/factories/make-seat'
import { InMemoryReservationExpirationRepository } from 'test/repositories/in-memory-reservation-expiration-repository'
import { InMemoryReservationsRepository } from 'test/repositories/in-memory-reservation-repository'
import { InMemorySeatsRepository } from 'test/repositories/in-memory-seats-repository'
import { InvalidReservationStatusError } from './errors/invalid-reservation-status.error'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { ExpireReservationUseCase } from './expire-reservation'

describe('Expire Reservation', () => {
  let inMemoryReservationsRepository: InMemoryReservationsRepository
  let inMemorySeatsRepository: InMemorySeatsRepository
  let inMemoryExpirationRepository: InMemoryReservationExpirationRepository
  let sut: ExpireReservationUseCase

  beforeEach(() => {
    inMemoryReservationsRepository = new InMemoryReservationsRepository()
    inMemorySeatsRepository = new InMemorySeatsRepository()
    inMemoryExpirationRepository = new InMemoryReservationExpirationRepository()

    sut = new ExpireReservationUseCase(
      inMemoryReservationsRepository,
      inMemorySeatsRepository,
      inMemoryExpirationRepository,
    )
  })

  it('should be able expire an ACTIVE reservation and free seat', async () => {
    const seat = makeSeat({ id: '1', status: 'RESERVED' })
    await inMemorySeatsRepository.create(seat)

    const reservation = makeReservation({
      id: '1',
      seatId: '1',
    })
    await inMemoryReservationsRepository.create(reservation)
    await inMemoryExpirationRepository.save('1', 30)

    const result = await sut.execute({ reservationId: '1' })

    expect(result.isRight()).toBe(true)

    const updated = await inMemoryReservationsRepository.findById('1')
    expect(updated?.status).toBe('EXPIRED')

    const updatedSeat = await inMemorySeatsRepository.findById('1')
    expect(updatedSeat?.status).toBe('AVAILABLE')
  })

  it('should not be able do nothing when reservation does not exist', async () => {
    const result = await sut.execute({ reservationId: '1' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able do nothing when reservation is not ACTIVE', async () => {
    const reservation = makeReservation({
      id: '1',
      seatId: '1',
      status: 'CONFIRMED',
    })
    await inMemoryReservationsRepository.create(reservation)

    const result = await sut.execute({ reservationId: '1' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidReservationStatusError)

    const updated = await inMemoryReservationsRepository.findById('1')
    expect(updated?.status).toBe('CONFIRMED')
  })
})

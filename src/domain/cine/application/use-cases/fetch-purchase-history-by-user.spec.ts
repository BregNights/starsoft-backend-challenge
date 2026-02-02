import { makeReservation } from 'test/factories/make-reservation'
import { makeUser } from 'test/factories/make-user'
import { InMemoryReservationsRepository } from 'test/repositories/in-memory-reservation-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FetchPurchaseHistoryByUserUseCase } from './fetch-purchase-history-by-user'

let inMemoryReservationsRepository: InMemoryReservationsRepository
let inMemoryUserRepository: InMemoryUsersRepository
let sut: FetchPurchaseHistoryByUserUseCase

describe('Fetch Purchase History By User', () => {
  beforeEach(() => {
    inMemoryReservationsRepository = new InMemoryReservationsRepository()
    inMemoryUserRepository = new InMemoryUsersRepository()
    sut = new FetchPurchaseHistoryByUserUseCase(
      inMemoryUserRepository,
      inMemoryReservationsRepository,
    )
  })

  it('should be able to fetch confirmed purchases from user', async () => {
    const userA = makeUser({ id: '1' })
    await inMemoryUserRepository.create(userA)
    const userB = makeUser({ id: '2' })
    await inMemoryUserRepository.create(userB)

    const reserveA = makeReservation({
      id: '1',
      userId: userA.id,
      status: 'CONFIRMED',
    })
    await inMemoryReservationsRepository.create(reserveA)

    const reserveB = makeReservation({
      id: '2',
      userId: userA.id,
      status: 'ACTIVE',
    })
    await inMemoryReservationsRepository.create(reserveB)

    const reserveC = makeReservation({
      id: '3',
      userId: userB.id,
      status: 'CONFIRMED',
    })
    await inMemoryReservationsRepository.create(reserveC)

    const result = await sut.execute({ userId: '1' })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.purchases).toHaveLength(1)
      expect(result.value.purchases[0].id).toBe('1')
    }
  })
})

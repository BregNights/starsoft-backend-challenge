import { Injectable } from '@nestjs/common'
import { RedisService } from './redis.service'
import { ReservationExpirationRepository } from './reservation-expiration-repository'

@Injectable()
export class RedisReservationExpirationRepository implements ReservationExpirationRepository {
  constructor(private redis: RedisService) {}

  async save(reservationId: string, ttl: number) {
    await this.redis.set(`reservation:${reservationId}`, 'ACTIVE', 'EX', ttl)
  }

  async exists(reservationId: string): Promise<boolean> {
    const value = await this.redis.get(`reservation:${reservationId}`)
    return value !== null
  }

  async remove(reservationId: string) {
    await this.redis.del(`reservation:${reservationId}`)
  }
}

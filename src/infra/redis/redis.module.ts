import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { RedisReservationExpirationRepository } from './redis-reservation-expiration-repository'
import { RedisService } from './redis.service'
import { ReservationExpirationRepository } from './reservation-expiration-repository'

@Module({
  imports: [EnvModule],
  providers: [
    RedisService,
    {
      provide: ReservationExpirationRepository,
      useClass: RedisReservationExpirationRepository,
    },
  ],
  exports: [ReservationExpirationRepository],
})
export class RedisModule {}

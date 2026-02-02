import { ExpireReservationUseCase } from '@/domain/cine/application/use-cases/expire-reservation'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { RedisModule } from '../redis/redis.module'
import { ExpireReservationsJob } from './expire-reservation.job'

@Module({
  imports: [DatabaseModule, RedisModule],
  providers: [ExpireReservationsJob, ExpireReservationUseCase],
})
export class JobsModule {}

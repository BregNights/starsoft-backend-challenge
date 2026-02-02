import { ConfirmReservationUseCase } from '@/domain/cine/application/use-cases/confirm-reservation'
import { CreateAccountUseCase } from '@/domain/cine/application/use-cases/create-account'
import { CreateReservationUseCase } from '@/domain/cine/application/use-cases/create-reservation'
import { CreateSessionUseCase } from '@/domain/cine/application/use-cases/create-session'
import { FetchPurchaseHistoryByUserUseCase } from '@/domain/cine/application/use-cases/fetch-purchase-history-by-user'
import { FetchSeatBySessionUseCase } from '@/domain/cine/application/use-cases/fetch-seat-by-session'
import { RegisterSeatUseCase } from '@/domain/cine/application/use-cases/register-seat'
import { Module } from '@nestjs/common'
import { ApiDocsController } from './controllers/api-docs.controller'
import { DatabaseModule } from '../database/database.module'
import { RedisModule } from '../redis/redis.module'
import { ConfirmReservationController } from './controllers/confirm-reservation.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateReservationController } from './controllers/create-reservation.controller'
import { CreateSessionController } from './controllers/create-session.controller'
import { FetchPurchaseHistoryByUserController } from './controllers/fetch-purchase-history-by-user.controller'
import { FetchSeatBySessionController } from './controllers/fetch-seat-by-session.controller'
import { RegisterSeatController } from './controllers/register-seat-controller'

@Module({
  imports: [DatabaseModule, RedisModule],
  controllers: [
    CreateAccountController,
    CreateSessionController,
    RegisterSeatController,
    FetchSeatBySessionController,
    FetchPurchaseHistoryByUserController,
    CreateReservationController,
    ConfirmReservationController,
    ApiDocsController,
  ],
  providers: [
    CreateAccountUseCase,
    CreateSessionUseCase,
    RegisterSeatUseCase,
    FetchSeatBySessionUseCase,
    FetchPurchaseHistoryByUserUseCase,
    CreateReservationUseCase,
    ConfirmReservationUseCase,
  ],
})
export class HttpModule {}

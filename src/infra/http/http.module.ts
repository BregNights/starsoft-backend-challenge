import { ConfirmReservationUseCase } from '@/domain/cine/application/use-cases/confirm-reservation'
import { CreateAccountUseCase } from '@/domain/cine/application/use-cases/create-account'
import { CreateReservationUseCase } from '@/domain/cine/application/use-cases/create-reservation'
import { CreateSessionUseCase } from '@/domain/cine/application/use-cases/create-session'
import { FetchSeatBySessionUseCase } from '@/domain/cine/application/use-cases/fetch-seat-by-session'
import { RegisterSeatUseCase } from '@/domain/cine/application/use-cases/register-seat'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { ConfirmReservationController } from './controllers/confirm-reservation.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateReservationController } from './controllers/create-reservation.controller'
import { CreateSessionController } from './controllers/create-session.controller'
import { FetchSeatBySessionController } from './controllers/fetch-seat-by-session.controller'
import { RegisterSeatController } from './controllers/register-seat-controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    CreateSessionController,
    RegisterSeatController,
    FetchSeatBySessionController,
    CreateReservationController,
    ConfirmReservationController,
  ],
  providers: [
    CreateAccountUseCase,
    CreateSessionUseCase,
    RegisterSeatUseCase,
    FetchSeatBySessionUseCase,
    CreateReservationUseCase,
    ConfirmReservationUseCase,
  ],
})
export class HttpModule {}

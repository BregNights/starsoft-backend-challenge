import { CreateSessionUseCase } from '@/domain/cine/application/use-cases/create-session'
import { CreateAccountUseCase } from '@/domain/cine/application/use-cases/create-user'
import { RegisterSeatUseCase } from '@/domain/cine/application/use-cases/register-seat'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateSessionController } from './controllers/create-session.controller'
import { CreateAccountController } from './controllers/create-user.controller'
import { RegisterSeatController } from './controllers/register-seat-controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    CreateSessionController,
    RegisterSeatController,
  ],
  providers: [CreateAccountUseCase, CreateSessionUseCase, RegisterSeatUseCase],
})
export class HttpModule {}

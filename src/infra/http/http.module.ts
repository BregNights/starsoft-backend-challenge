import { CreateAccountUseCase } from '@/domain/cine/application/use-cases/create-user'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateAccount } from './controllers/create-user.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateAccount],
  providers: [CreateAccountUseCase],
})
export class HttpModule {}

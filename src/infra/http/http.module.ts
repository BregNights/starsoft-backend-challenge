import { TestUseCase } from '@/domain/cine/application/use-cases/test'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { TestController } from './controllers/test.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [TestController],
  providers: [TestUseCase],
})
export class HttpModule {}

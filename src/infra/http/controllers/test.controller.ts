import { TestUseCase } from '@/domain/cine/application/use-cases/test'
import { Controller, Get, HttpCode } from '@nestjs/common'

@Controller('/')
export class TestController {
  constructor(private test: TestUseCase) {}
  @Get()
  @HttpCode(201)
  async handle() {
    const result = await this.test.execute()

    return result
  }
}

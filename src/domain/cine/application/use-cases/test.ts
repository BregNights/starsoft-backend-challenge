import { Injectable } from '@nestjs/common'

@Injectable()
export class TestUseCase {
  async execute() {
    return 'ok'
  }
}

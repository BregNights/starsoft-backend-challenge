import { FetchSeatBySessionUseCase } from '@/domain/cine/application/use-cases/fetch-seat-by-session'
import {
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { SeatPresenter } from '../presenters/seat-presenter'

@Controller('/sessions/:id/seats')
export class FetchSeatBySessionController {
  constructor(private usecase: FetchSeatBySessionUseCase) {}
  @Get()
  @HttpCode(200)
  async handle(@Param('id') id: string) {
    const result = await this.usecase.execute({
      sessionId: id,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new ConflictException(error.message)
    }

    return { seats: result.value.seat.map(SeatPresenter.toHTTP) }
  }
}

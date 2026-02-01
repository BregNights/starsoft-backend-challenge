import { ConfirmReservationUseCase } from '@/domain/cine/application/use-cases/confirm-reservation'
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const confirmReservationBodySchema = z.object({
  reservationId: z.string(),
  userId: z.string(),
})

type ConfirmReservationBodySchema = z.infer<typeof confirmReservationBodySchema>

@Controller('/reservations/confirm')
export class ConfirmReservationController {
  constructor(private usecase: ConfirmReservationUseCase) {}
  @Post()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(confirmReservationBodySchema))
  async handle(@Body() body: ConfirmReservationBodySchema) {
    const { reservationId, userId } = body
    const result = await this.usecase.execute({ reservationId, userId })

    if (result.isLeft()) {
      const error = result.value
      throw new ConflictException(error.message)
    }
  }
}

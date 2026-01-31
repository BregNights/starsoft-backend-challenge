import { CreateReservationUseCase } from '@/domain/cine/application/use-cases/create-reservation'
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

const createReservationBodySchema = z.object({
  seatId: z.string(),
  sessionId: z.string(),
  userId: z.string(),
})

type CreateReservationBodySchema = z.infer<typeof createReservationBodySchema>

@Controller('/reservations')
export class CreateReservationController {
  constructor(private usecase: CreateReservationUseCase) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createReservationBodySchema))
  async handle(@Body() body: CreateReservationBodySchema) {
    const { seatId, sessionId, userId } = body
    const result = await this.usecase.execute({ seatId, sessionId, userId })

    if (result.isLeft()) {
      const error = result.value
      throw new ConflictException(error.message)
    }
  }
}

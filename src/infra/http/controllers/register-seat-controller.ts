import { RegisterSeatUseCase } from '@/domain/cine/application/use-cases/register-seat'
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

const registerSeatBodySchema = z.object({
  seatNumbers: z.array(z.string()).min(16, 'Minimum of 16 seats'),
  sessionId: z.string(),
})

type RegisterSeatBodySchema = z.infer<typeof registerSeatBodySchema>

@Controller('/seats')
export class RegisterSeatController {
  constructor(private usecase: RegisterSeatUseCase) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerSeatBodySchema))
  async handle(@Body() body: RegisterSeatBodySchema) {
    const { seatNumbers, sessionId } = body

    const result = await this.usecase.execute({
      seatNumbers,
      sessionId,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new ConflictException(error.message)
    }
  }
}

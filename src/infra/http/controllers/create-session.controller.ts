import { CreateSessionUseCase } from '@/domain/cine/application/use-cases/create-session'
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

const createSessionBodySchema = z.object({
  movieTitle: z.string(),
  price: z.number(),
  room: z.string(),
  startsAt: z.coerce.date(),
})

type CreateSessionBodySchema = z.infer<typeof createSessionBodySchema>

@Controller('/sessions')
export class CreateSessionController {
  constructor(private usecase: CreateSessionUseCase) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createSessionBodySchema))
  async handle(@Body() body: CreateSessionBodySchema) {
    const { movieTitle, price, room, startsAt } = body

    const result = await this.usecase.execute({
      movieTitle,
      price,
      room,
      startsAt,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new ConflictException(error.message)
    }
  }
}

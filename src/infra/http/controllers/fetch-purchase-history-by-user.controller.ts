import { FetchPurchaseHistoryByUserUseCase } from '@/domain/cine/application/use-cases/fetch-purchase-history-by-user'
import {
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { PurchaseHistoryPresenter } from '../presenters/purchase-history-presenter'

@Controller('/users/:id/purchases')
export class FetchPurchaseHistoryByUserController {
  constructor(private usecase: FetchPurchaseHistoryByUserUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('id') id: string) {
    const result = await this.usecase.execute({
      userId: id,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new ConflictException(error.message)
    }

    return {
      purchases: result.value.purchases.map(PurchaseHistoryPresenter.toHTTP),
    }
  }
}

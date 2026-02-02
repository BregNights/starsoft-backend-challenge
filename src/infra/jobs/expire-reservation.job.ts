import { ReservationsRepository } from '@/domain/cine/application/repositories/reservation-repository'
import { ExpireReservationUseCase } from '@/domain/cine/application/use-cases/expire-reservation'
import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class ExpireReservationsJob {
  private readonly logger = new Logger(ExpireReservationsJob.name)

  constructor(
    private reservationsRepository: ReservationsRepository,
    private expireReservationUseCase: ExpireReservationUseCase,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handle() {
    const now = new Date()

    const expiredReservations =
      await this.reservationsRepository.findManyExpired(now)

    if (expiredReservations.length === 0) {
      return
    }

    this.logger.log(`Found ${expiredReservations.length} expired reservations`)

    for (const reservation of expiredReservations) {
      if (!reservation.id) continue

      await this.expireReservationUseCase.execute({
        reservationId: reservation.id,
      })
    }
  }
}

import { ReservationsRepository } from '@/domain/cine/application/repositories/reservation-repository'
import { SeatsRepository } from '@/domain/cine/application/repositories/seat-respository'
import { SessionsRepository } from '@/domain/cine/application/repositories/session-repository'
import { UsersRepository } from '@/domain/cine/application/repositories/users-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaReservationsRepository } from './prisma/repositories/prisma-reservation-repository'
import { PrismaSeatsRepository } from './prisma/repositories/prisma-seats-repository'
import { PrismaSessionsRepository } from './prisma/repositories/prisma-sessions-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: SessionsRepository,
      useClass: PrismaSessionsRepository,
    },
    {
      provide: SeatsRepository,
      useClass: PrismaSeatsRepository,
    },
    {
      provide: ReservationsRepository,
      useClass: PrismaReservationsRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    SessionsRepository,
    SeatsRepository,
    ReservationsRepository,
  ],
})
export class DatabaseModule {}

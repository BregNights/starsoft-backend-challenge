import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { envSchema } from './infra/env/env'
import { EnvModule } from './infra/env/env.module'
import { HttpModule } from './infra/http/http.module'
import { JobsModule } from './infra/jobs/jobs.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    EnvModule,
    JobsModule,
  ],
})
export class AppModule {}

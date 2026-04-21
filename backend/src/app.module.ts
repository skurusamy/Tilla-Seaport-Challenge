import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { SeaportsModule } from './seaports/seaports.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SeaportsModule,
    JobsModule,
    PrismaModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    })
  ]
})
export class AppModule {}

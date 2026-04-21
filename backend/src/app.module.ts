import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { SeaportsModule } from './seaports/seaports.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    SeaportsModule,
    PrismaModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    })
  ]
})
export class AppModule {}

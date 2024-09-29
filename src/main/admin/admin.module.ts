import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { join } from 'path';
import { RoleModule } from './role/role.module';
import { AuthAdminModule } from './auth/auth.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { EventModule } from '../shared/event/event.module';
import { DeviceModule } from '../shared/device/device.module';
import { EventTypeModule } from '../shared/eventType/eventType.module';
import { HumanResourceModule } from '../shared/humanResources/humanResource.module';
import { LocationModule } from '../shared/location/location.module';
import { ContractModule } from '../shared/contract/contract.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/admin',
      playground: false,
      autoSchemaFile: join(process.cwd(), 'schemaAdmin.gql'),
      sortSchema: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: any = {
          statusCode: error.extensions?.exception?.code || 500,
          message: error.message,
        };
        return graphQLFormattedError;
      },
      include: [
        RoleModule,
        AuthAdminModule,
        EventModule,
        DeviceModule,
        EventTypeModule,
        HumanResourceModule,
        LocationModule,
        ContractModule
      ],
    }),
    RoleModule,
    AuthAdminModule,
    EventModule,
    DeviceModule,
    EventTypeModule,
    HumanResourceModule,
    LocationModule,
    ContractModule
  ],
})
export class AdminModule {}

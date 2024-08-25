import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { join } from 'path';
import { UploadModule } from '../shared/upload/upload.module';
import { AuthClientModule } from './auth/auth.module';
import { RoleModule } from '../admin/role/role.module';
import { UserModule } from '../shared/user/user.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { EventTypeModule } from '../shared/eventType/eventType.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/client',
      autoSchemaFile: join(process.cwd(), 'schemaClient.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: any = {
          statusCode: error.extensions?.exception?.code || 500,
          message: error.message,
        };
        return graphQLFormattedError;
      },
      include: [
        UploadModule,
        AuthClientModule,
        RoleModule,
        UserModule,
        EventTypeModule,
      ],
    }),
    UploadModule,
    AuthClientModule,
    RoleModule,
    UserModule,
    EventTypeModule,
  ],
})
export class ClientModule {}

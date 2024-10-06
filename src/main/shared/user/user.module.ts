import { Module } from '@nestjs/common';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserRepository } from '@/db/repositories/user.repository';

@Module({
  providers: [UserResolver, UserService, UserRepository],
  exports: [UserResolver, UserService, UserRepository],
})
export class UserModule {}

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ChangePasswordInput, UserUpdateInput } from './dto/request';
import { IUser } from './interface';
import { UserService } from './user.service';

import { Auth } from '@/decorators/auth.decorator';
import { Context, GetContext } from '@/decorators/user.decorator';
import { ResponseMessageBase } from '@/common/interfaces/returnBase';
import { UsersData } from './dto/response/users.response';
import { ROLE } from '@/common/constant';
import { Roles } from '@/decorators/roles.decorator';
import { GetUsersRequest } from './dto/request/getUsers.request';

@Auth()
@Resolver()
export class UserResolver {
  constructor(protected service: UserService) {}

  @Mutation(() => IUser)
  async updateMe(
    @Args('input') userUpdateInput: UserUpdateInput,
    @GetContext() ctx: Context,
  ): Promise<IUser> {
    return this.service.updateUser(userUpdateInput, ctx);
  }

  @Query(() => IUser, { name: 'getMe' })
  async getMe(@GetContext() ctx: Context) {
    const { currentUser } = ctx;
    return await this.service.getOne(currentUser.id);
  }

  @Query(() => UsersData, { name: 'getUsers' })
  async getUsers(@Args('queryParams') queryParams: GetUsersRequest) {
    return this.service.getUsers(queryParams);
  }

  @Mutation(() => ResponseMessageBase, { name: 'changePassword' })
  async changePassword(
    @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
    @GetContext() ctx: Context,
  ) {
    return this.service.changePassword(changePasswordInput, ctx);
  }
  @Roles(ROLE.Admin)
  @Mutation(() => ResponseMessageBase)
  async deactivateUser(@Args('id') id: string) {
    return this.service.deactivateUser(id);
  }

  @Roles(ROLE.Admin)
  @Mutation(() => ResponseMessageBase)
  async activateUser(@Args('id') id: string) {
    return this.service.activateUser(id);
  }
}

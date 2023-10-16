import { Controller, Get, Param, Body, Post, Put, Query } from '@nestjs/common';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { UsersService } from './users.service';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { User } from 'src/common/decorators/user.decorator';
import { UserDocument, UserFlattened } from './user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put(':id/assign')
  async assignToSite(
    @User() user: UserFlattened,
    @Param('id', ValidateObjectIdPipe) userId: string,
    @Query('site-id', ValidateObjectIdPipe) siteId: string,
  ) {
    return await this.usersService.assignToSite(user, userId, siteId);
  }

  @Put(':id/unassign')
  async unassignFromSite(
    @User() user: UserFlattened,
    @Param('id', ValidateObjectIdPipe) userId: string,
    @Query('site-id', ValidateObjectIdPipe) siteId: string,
  ) {
    return await this.usersService.unassignFromSite(user, userId, siteId);
  }

  @Post('search')
  async getUsersPage(@Body() pageRequest: PageRequest) {
    return await this.usersService.getUserPage(pageRequest);
  }

  @Get(':id')
  async getUser(@Param('id', ValidateObjectIdPipe) id: string) {
    const { password, ...user } = await this.usersService.getUser(id);
    return user;
  }
}

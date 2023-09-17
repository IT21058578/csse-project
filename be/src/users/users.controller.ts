import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('search')
  async getUsersPage(@Body() pageRequest: PageRequest) {
    return await this.usersService.getUserPage(pageRequest);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const { password, ...user } = await this.usersService.getUser(id);
    return user;
  }
}

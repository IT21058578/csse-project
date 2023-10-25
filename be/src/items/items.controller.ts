import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { User } from 'src/common/decorators/user.decorator';
import { UserFlattened } from 'src/users/user.schema';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dtos/create-item.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get('search')
  async getItemsPage(@Body() pageRequest: PageRequest) {
    return await this.itemsService.getItemsPage(pageRequest);
  }

  @Put(':id')
  // @Roles(UserRole.COMPANY_ADMIN, UserRole.SYSTEM_ADMIN)
  async editItem(
    @User() user: UserFlattened,
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() editItemDto: CreateItemDto,
  ) {
    return await this.itemsService.editItem(user, id, editItemDto);
  }

  @Get(':id')
  async getItem(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.itemsService.getItem(id);
  }

  @Post()
  // @Roles(UserRole.COMPANY_ADMIN, UserRole.SYSTEM_ADMIN)
  async createItem(
    @User() user: UserFlattened,
    @Body() createItemDto: CreateItemDto,
  ) {
    return await this.itemsService.createItem(user, createItemDto);
  }
}

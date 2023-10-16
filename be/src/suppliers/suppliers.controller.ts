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
import { CreateSupplierDto } from './dtos/create-supplier.dto';
import { SuppliersService } from './suppliers.service';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get('search')
  async getSuppliersPage(@Body() pageRequest: PageRequest) {
    return await this.suppliersService.getSuppliersPage(pageRequest);
  }

  @Put(':id')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.SYSTEM_ADMIN)
  async editSupplier(
    @User() user: UserFlattened,
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() editSupplierDto: CreateSupplierDto,
  ) {
    return await this.suppliersService.editSupplier(user, id, editSupplierDto);
  }

  @Delete(':id')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.SYSTEM_ADMIN)
  async deleteSupplier(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.suppliersService.deleteSupplier(id);
  }

  @Get(':id')
  async getSupplier(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.suppliersService.getSupplier(id);
  }

  @Post()
  @Roles(UserRole.COMPANY_ADMIN, UserRole.SYSTEM_ADMIN)
  async createSupplier(
    @User() user: UserFlattened,
    @Body() createSupplierDto: CreateSupplierDto,
  ) {
    return await this.suppliersService.createSupplier(user, createSupplierDto);
  }
}

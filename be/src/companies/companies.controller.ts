import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { User } from 'src/common/decorators/user.decorator';
import { UserDocument } from 'src/users/user.schema';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('search')
  async getCompaniesPage(@Body() pageRequest: PageRequest) {
    return await this.companiesService.getCompaniesPage(pageRequest);
  }

  @Put(':id')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.COMPANY_ADMIN)
  async editCompany(
    @User() user: UserDocument,
    @Param('id') id: string,
    @Body() editCompanyDto: CreateCompanyDto,
  ) {
    return await this.companiesService.editCompany(user, id, editCompanyDto);
  }

  @Delete(':id')
  @Roles(UserRole.SYSTEM_ADMIN)
  async deleteCompany(@Param('id') id: string) {
    return await this.companiesService.deleteCompany(id);
  }

  @Get('')
  async getCompany(@Param('id') id: string) {
    return await this.companiesService.getCompany(id);
  }

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN)
  async createCompany(
    @User() user: UserDocument,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    return await this.companiesService.createCompany(user, createCompanyDto);
  }
}

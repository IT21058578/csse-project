import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dtos/create-site.dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { User } from 'src/common/decorators/user.decorator';
import { UserFlattened } from 'src/users/user.schema';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get('search')
  async getSitesPage(@Body() pageRequest: PageRequest) {
    return await this.sitesService.getSitesPage(pageRequest);
  }

  @Put(':id')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.SITE_ADMIN, UserRole.SYSTEM_ADMIN)
  async editSite(
    @User() user: UserFlattened,
    @Param('id') id: string,
    @Body() editSiteDto: CreateSiteDto,
  ) {
    return await this.sitesService.editSite(user, id, editSiteDto);
  }

  @Get(':id')
  async getSite(@Param('id') id: string) {
    return await this.sitesService.getSite(id);
  }

  @Post()
  @Roles(UserRole.COMPANY_ADMIN, UserRole.SITE_ADMIN, UserRole.SYSTEM_ADMIN)
  async createSite(
    @User() user: UserFlattened,
    @Body() createSiteDto: CreateSiteDto,
  ) {
    return await this.sitesService.createSite(user, createSiteDto);
  }
}

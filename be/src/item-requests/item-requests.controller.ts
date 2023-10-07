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
import { UserDocument, UserFlattened } from 'src/users/user.schema';
import { ItemRequestsService } from './item-requests.service';
import { CreateProcurementDto } from './dto/create-procurement.dto';

@Controller('procurements')
export class ItemRequestsController {
  constructor(private readonly procurementsService: ItemRequestsService) {}

  @Get('search')
  async getItemRequestPage(@Body() pageRequest: PageRequest) {
    return await this.procurementsService.getItemRequestPage(pageRequest);
  }

  @Put(':id')
  @Roles(UserRole.SITE_ADMIN)
  async editProcurement(
    @User() user: UserFlattened,
    @Param('id') id: string,
    @Body() editProcurementDto: CreateProcurementDto,
  ) {
    return await this.procurementsService.editProcurement(
      user,
      id,
      editProcurementDto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.SITE_ADMIN)
  async deleteProcurement(@Param('id') id: string) {
    return await this.procurementsService.deleteProcurement(id);
  }

  @Get('')
  async getProcurement(@Param('id') id: string) {
    return await this.procurementsService.getProcurement(id);
  }

  @Post()
  @Roles(UserRole.SITE_ADMIN)
  async createProcurement(
    @User() user: UserFlattened,
    @Body() createProcurementDto: CreateProcurementDto,
  ) {
    return await this.procurementsService.createProcurement(
      user,
      createProcurementDto,
    );
  }
}

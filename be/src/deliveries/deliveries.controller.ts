import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { User } from 'src/common/decorators/user.decorator';
import { UserDocument } from 'src/users/user.schema';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dtos/create-delivery.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get('search')
  async getDeliveriesPage(@Body() pageRequest: PageRequest) {
    return await this.deliveriesService.getDeliveriesPage(pageRequest);
  }

  @Get(':id')
  async getDelivery(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.deliveriesService.getDelivery(id);
  }

  @Post()
  // @Roles(UserRole.SYSTEM_ADMIN, UserRole.SITE_ADMIN)
  async createDelivery(
    @User() user: UserDocument,
    @Body() createDeliveryDto: CreateDeliveryDto,
  ) {
    return await this.deliveriesService.createDelivery(user, createDeliveryDto);
  }
}

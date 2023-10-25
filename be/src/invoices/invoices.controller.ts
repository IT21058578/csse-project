import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { User } from 'src/common/decorators/user.decorator';
import { UserDocument } from 'src/users/user.schema';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('search')
  async getInvoicesPage(@Body() pageRequest: PageRequest) {
    return await this.invoicesService.getInvoicesPage(pageRequest);
  }

  @Get(':id')
  async getInvoice(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.invoicesService.getInvoice(id);
  }

  @Post()
  // @Roles(UserRole.SYSTEM_ADMIN)
  async createInvoice(
    @User() user: UserDocument,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ) {
    return await this.invoicesService.createInvoice(user, createInvoiceDto);
  }
}

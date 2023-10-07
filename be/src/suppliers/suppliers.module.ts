import { Module } from '@nestjs/common';
import { CompaniesModule } from 'src/companies/companies.module';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { Supplier, SupplierSchema } from './supplier.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    CompaniesModule,
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
    ]),
  ],
  providers: [SuppliersService],
  controllers: [SuppliersController],
  exports: [SuppliersService, MongooseModule],
})
export class SuppliersModule {}

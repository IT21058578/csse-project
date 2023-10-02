import { Module } from '@nestjs/common';
import { DataGenService } from './data-gen.service';
import { DataGenController } from './data-gen.controller';
import { UsersModule } from 'src/users/users.module';
import { ItemRequestsModule } from 'src/item-requests/item-requests.module';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
  providers: [DataGenService],
  controllers: [DataGenController],
  imports: [UsersModule, ItemRequestsModule, UsersModule, CompaniesModule],
})
export class DataGenModule {}

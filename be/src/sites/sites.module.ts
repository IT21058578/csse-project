import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { CompaniesModule } from 'src/companies/companies.module';
import { SitesController } from './sites.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from './site.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }]),
    CompaniesModule,
  ],
  providers: [SitesService],
  controllers: [SitesController],
  exports: [SitesService, MongooseModule],
})
export class SitesModule {}

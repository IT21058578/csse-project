import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ItemsModule } from './items/items.module';
import { SuppliersService } from './suppliers/suppliers.service';
import { SitesModule } from './sites/sites.module';
import { ItemRequestsModule } from './item-requests/item-requests.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { TokenService } from './token/token.service';
import { TokenModule } from './token/token.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { JwtTokenModule } from './jwt-token/jwt-token.module';
import { JwtTokenService } from './jwt-token/jwt-token.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth-guard.guard';
import { RolesGuard } from './common/guards/roles-guard.guard';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { ConfigKey } from './common/enums/config-key.enum';
import { HttpModule } from '@nestjs/axios';
import { PDFModule } from '@t00nday/nestjs-pdf';
import { ItemRequestsService } from './item-requests/item-requests.service';
import { SitesService } from './sites/sites.service';
import { ItemsService } from './items/items.service';
import { CompaniesService } from './companies/companies.service';
import { FileModule } from './file/file.module';
import { DataGenModule } from './data-gen/data-gen.module';
import { DataGenService } from './data-gen/data-gen.service';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { InvoicesModule } from './invoices/invoices.module';
import { DeliveriesService } from './deliveries/deliveries.service';
import { ApprovalsService } from './approvals/approvals.service';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TokenModule,
    JwtTokenModule,
    EmailModule,
    HttpModule,
    ItemRequestsModule,
    SitesModule,
    ItemsModule,
    SuppliersModule,
    CompaniesModule,
    DataGenModule,
    DeliveriesModule,
    ApprovalsModule,
    InvoicesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PDFModule.register({
      isGlobal: true,
      view: {
        root: __dirname + './../assets/templates',
        engine: 'handlebars',
        extension: 'hbs',
      },
    }),
    FileModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        authDomain: configService.get(ConfigKey.FIREBASE_AUTH_DOMAIN),
        storageBucket: configService.get(ConfigKey.FIREBASE_BUCKET_NAME),
        projectId: configService.get(ConfigKey.FIREBASE_PROJECT_ID),
        appId: configService.get(ConfigKey.FIREBASE_APP_ID),
        apiKey: configService.get(ConfigKey.FIREBASE_API_KEY),
        measurementId: configService.get(ConfigKey.FIREBASE_MEASUREMENT_ID),
        messagingSenderId: configService.get(
          ConfigKey.FIREBASE_MESSAGING_SENDER_ID,
        ),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get(ConfigKey.MONGO_URI),
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get(ConfigKey.SMTP_HOST),
          port: 465,
          secure: true,
          auth: {
            user: configService.get(ConfigKey.SMTP_USER),
            pass: configService.get(ConfigKey.SMTP_PASS),
          },
          connectionTimeout: 1 * 60 * 1000,
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: __dirname + './../assets/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    UsersService,
    TokenService,
    JwtTokenService,
    EmailService,
    ItemRequestsService,
    SitesService,
    ItemsService,
    SuppliersService,
    CompaniesService,
    DataGenService,
    SitesService,
    DeliveriesService,
    ApprovalsService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

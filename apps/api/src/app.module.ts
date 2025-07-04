import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CompaniesModule } from './companies/companies.module';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from './clients/clients.module';
import { JobsModule } from './jobs/jobs.module';
import { QuotationsModule } from './quotations/quotations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    CompaniesModule,
    ClientsModule,
    JobsModule,
    QuotationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesModule } from 'src/invoices/invoices.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportModule } from './report/report.module';
import { HealthModule } from './health/health.module';
import { RabbitMQModule } from './common/rabbitmq.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/payever',
    ),
    ScheduleModule.forRoot(),
    RabbitMQModule,
    InvoicesModule,
    ReportModule,
    HealthModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { InvoicesModule } from '../invoices/invoices.module';
import { RabbitMQModule } from '../common/rabbitmq.module';

@Module({
  imports: [InvoicesModule, RabbitMQModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}

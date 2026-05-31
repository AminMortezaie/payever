import { Injectable, Logger } from '@nestjs/common';
import { ReportDto } from './dto/report.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  sendEmail(data: ReportDto): void {
    this.logger.log('📧 Sending email with report data:');
    this.logger.log(`Total Sales: $${data.totalSales}`);
    this.logger.log('Items:');
    data.items.forEach(item => {
      this.logger.log(`- ${item.sku}: ${item.totalQty} units`);
    });
    
    // Simulate sending email
    this.logger.log('✅ Email sent successfully!');
  }
}

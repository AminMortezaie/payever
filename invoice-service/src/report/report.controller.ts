import { Controller, Post, Logger } from '@nestjs/common';
import { ReportService } from './report.service';
import { SalesReport } from './interfaces/report.interface';

@Controller('reports')
export class ReportController {
  private readonly logger = new Logger(ReportController.name);

  constructor(private readonly reportService: ReportService) {}

  // Manual report generation - for testing purposes
  @Post('generate')
  async generateReport(): Promise<{ message: string; report: SalesReport }> {
    this.logger.log('Manual report generation triggered');
    const report = await this.reportService.generateManualReport();
    return {
      message: 'Report generated and sent to email service',
      report,
    };
  }
}

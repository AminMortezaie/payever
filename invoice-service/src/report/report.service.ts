import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';
import { Services, Queues } from '../common/enums';
import { InvoicesService } from '../invoices/invoices.service';
import { ReportItem, SalesReport } from './interfaces/report.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ReportService implements OnModuleInit {
  private readonly logger = new Logger(ReportService.name);
  constructor(
    private readonly invoicesService: InvoicesService,
    @Inject(Services.REPORT_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ:', error);
    }
  }

  @Cron('0 0 12 * * *')
  async handleCron(): Promise<void> {
    try {
      const { start, end } = this.getTodayRange();
      this.logger.log(
        `Generating report for ${start.toISOString()} → ${end.toISOString()}`,
      );

      const report = await this.buildReport(start, end);
      await this.publishReport(report);
    } catch (error) {
      this.logger.error('Error in cron job:', error);
    }
  }

  // New method to manually trigger report generation for testing purposes
  async generateManualReport(): Promise<SalesReport> {
    try {
      const { start, end } = this.getTodayRange();
      this.logger.log(
        `Manually generating report for ${start.toISOString()} → ${end.toISOString()}`,
      );

      const report = await this.buildReport(start, end);
      await this.publishReport(report);
      return report;
    } catch (error) {
      this.logger.error('Error in manual report generation:', error);
      throw error;
    }
  }

  private getTodayRange(): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  private async buildReport(start: Date, end: Date): Promise<SalesReport> {
    const invoices = await this.invoicesService.findAll(
      start.toISOString(),
      end.toISOString(),
    );
    const totalSales = this.calculateTotalSales(invoices);
    const items = this.calculateSkuSummary(invoices);

    return { totalSales, items };
  }

  private calculateTotalSales(invoices: Array<{ amount: number }>): number {
    return invoices.reduce((sum, inv) => sum + inv.amount, 0);
  }

  private calculateSkuSummary(
    invoices: Array<{ items: Array<{ sku: string; qt: number }> }>,
  ): ReportItem[] {
    const skuMap = new Map<string, number>();

    invoices.forEach((inv) =>
      inv.items.forEach((item) => {
        const currentQty = skuMap.get(item.sku) || 0;
        skuMap.set(item.sku, currentQty + item.qt);
      }),
    );

    return Array.from(skuMap.entries()).map(([sku, totalQty]) => ({
      sku,
      totalQty,
    }));
  }

  private async publishReport(report: SalesReport): Promise<void> {
    try {
      await lastValueFrom(this.client.emit(Queues.DAILY_SALES_REPORT, report));
      this.logger.log(`Published report: ${JSON.stringify(report)}`);
    } catch (error) {
      this.logger.error('Failed to publish report:', error);
      throw error;
    }
  }
}

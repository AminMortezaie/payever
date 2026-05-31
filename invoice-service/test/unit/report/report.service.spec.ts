import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from 'src/report/report.service';
import { InvoicesService } from 'src/invoices/invoices.service';
import { ClientProxy } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { of } from 'rxjs';
import { Queues, Services } from 'src/common/enums';

describe('ReportService', () => {
  let service: ReportService;
  let invoicesService: InvoicesService;
  let clientProxy: ClientProxy;
  let logger: Logger;

  const mockInvoicesService = {
    findAll: jest.fn(),
  };

  const mockClientProxy = {
    connect: jest.fn(),
    emit: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: InvoicesService,
          useValue: mockInvoicesService,
        },
        {
          provide: Services.REPORT_SERVICE,
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    invoicesService = module.get<InvoicesService>(InvoicesService);
    clientProxy = module.get<ClientProxy>('REPORT_SERVICE');

    // Mock the logger
    jest.spyOn(Logger.prototype, 'log').mockImplementation(mockLogger.log);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(mockLogger.error);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to RabbitMQ successfully', async () => {
      mockClientProxy.connect.mockResolvedValueOnce(undefined);
      await service.onModuleInit();
      expect(mockClientProxy.connect).toHaveBeenCalled();
    });

    it('should handle connection errors gracefully', async () => {
      const error = new Error('Connection failed');
      mockClientProxy.connect.mockRejectedValueOnce(error);
      await service.onModuleInit();
      expect(mockClientProxy.connect).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to connect to RabbitMQ:',
        error,
      );
    });
  });

  describe('handleCron', () => {
    it('should generate and publish a report successfully', async () => {
      // Mock date to ensure consistent test results
      const mockDate = new Date('2025-04-26T12:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      // Mock invoice data
      const mockInvoices = [
        {
          amount: 100,
          items: [{ sku: 'PROD-001', qt: 2 }],
        },
        {
          amount: 200,
          items: [{ sku: 'PROD-002', qt: 1 }],
        },
      ];

      // Mock service methods
      mockInvoicesService.findAll.mockResolvedValueOnce(mockInvoices);
      mockClientProxy.emit.mockReturnValueOnce(of(undefined));

      // Call the cron handler
      await service.handleCron();

      // Verify the report was generated and published
      expect(mockInvoicesService.findAll).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );
      expect(mockClientProxy.emit).toHaveBeenCalledWith(
        Queues.DAILY_SALES_REPORT,
        expect.objectContaining({
          totalSales: 300,
          items: expect.arrayContaining([
            { sku: 'PROD-001', totalQty: 2 },
            { sku: 'PROD-002', totalQty: 1 },
          ]),
        }),
      );
    });

    it('should handle errors gracefully', async () => {
      // Mock date
      const mockDate = new Date('2025-04-26T12:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      // Mock error
      const error = new Error('Failed to generate report');
      mockInvoicesService.findAll.mockRejectedValueOnce(error);

      // Call the cron handler
      await service.handleCron();

      // Verify error was logged
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error in cron job:',
        error,
      );
    });
  });
});

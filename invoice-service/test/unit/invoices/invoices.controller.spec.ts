import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from 'src/invoices/invoices.controller';
import { InvoicesService } from 'src/invoices/invoices.service';
import { CreateInvoiceDto } from 'src/invoices/dto/create-invoice.dto';
import { FindAllInvoicesDto } from 'src/invoices/dto/find-all-invoices.dto';
import { EntityNotFoundException } from 'src/common/exceptions/entity-not-found.exception';
import { InvalidIdException } from 'src/common/exceptions/invalid-id.exception';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let service: InvoicesService;

  const mockInvoice = {
    _id: '507f1f77bcf86cd799439011',
    amount: 100,
    date: new Date('2024-04-26'),
    description: 'Test Invoice',
  };

  const mockInvoicesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
          useValue: mockInvoicesService,
        },
      ],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    service = module.get<InvoicesService>(InvoicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new invoice', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        customer: 'Test Customer',
        amount: 100,
        reference: 'INV-001',
        date: new Date('2024-04-26'),
        items: [
          {
            sku: 'SKU-001',
            qt: 1,
          },
        ],
      };

      mockInvoicesService.create.mockResolvedValue(mockInvoice);

      const result = await controller.create(createInvoiceDto);

      expect(result).toEqual(mockInvoice);
      expect(mockInvoicesService.create).toHaveBeenCalledWith(createInvoiceDto);
    });
  });

  describe('findAll', () => {
    it('should return all invoices', async () => {
      const query: FindAllInvoicesDto = {
        start: '2024-04-01',
        end: '2024-04-30',
      };

      const mockInvoices = [mockInvoice];
      mockInvoicesService.findAll.mockResolvedValue(mockInvoices);

      const result = await controller.findAll(query);

      expect(result).toEqual(mockInvoices);
      expect(mockInvoicesService.findAll).toHaveBeenCalledWith(
        query.start,
        query.end,
      );
    });
  });

  describe('findOne', () => {
    it('should return an invoice when it exists', async () => {
      mockInvoicesService.findOne.mockResolvedValue(mockInvoice);

      const result = await controller.findOne(mockInvoice._id);

      expect(result).toEqual(mockInvoice);
      expect(mockInvoicesService.findOne).toHaveBeenCalledWith(mockInvoice._id);
    });

    it('should throw InvalidIdException when id is invalid', async () => {
      const invalidId = 'invalid-id';

      await expect(controller.findOne(invalidId)).rejects.toThrow(
        InvalidIdException,
      );
      expect(mockInvoicesService.findOne).not.toHaveBeenCalled();
    });

    it('should throw EntityNotFoundException when invoice does not exist', async () => {
      mockInvoicesService.findOne.mockRejectedValue(
        new EntityNotFoundException('Invoice', '507f1f77bcf86cd799439011'),
      );

      await expect(
        controller.findOne('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(EntityNotFoundException);
      expect(mockInvoicesService.findOne).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });
  });
});

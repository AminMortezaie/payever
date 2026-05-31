import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from 'src/invoices/invoices.service';
import { getModelToken } from '@nestjs/mongoose';
import { Invoice } from 'src/invoices/invoice.schema';
import { Model } from 'mongoose';
import { EntityNotFoundException } from 'src/common/exceptions/entity-not-found.exception';
import { CreateInvoiceDto } from 'src/invoices/dto/create-invoice.dto';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let model: Model<Invoice>;

  const mockInvoice = {
    _id: '507f1f77bcf86cd799439011',
    amount: 100,
    date: new Date('2024-04-26'),
    description: 'Test Invoice',
  };

  class MockModel {
    constructor(data: any) {
      return {
        ...data,
        save: jest.fn().mockResolvedValue(mockInvoice),
      };
    }
    static find = jest.fn().mockReturnThis();
    static findById = jest.fn().mockReturnThis();
    static exec = jest.fn().mockResolvedValue(mockInvoice);
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: getModelToken(Invoice.name),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    model = module.get<Model<Invoice>>(getModelToken(Invoice.name));
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

      const result = await service.create(createInvoiceDto);

      expect(result).toEqual(mockInvoice);
    });
  });

  describe('findAll', () => {
    it('should return all invoices when no date range is provided', async () => {
      const mockInvoices = [mockInvoice];
      MockModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockInvoices),
      });

      const result = await service.findAll();

      expect(result).toEqual(mockInvoices);
      expect(MockModel.find).toHaveBeenCalledWith({});
    });

    it('should return filtered invoices when date range is provided', async () => {
      const start = '2024-04-01';
      const end = '2024-04-30';
      const mockInvoices = [mockInvoice];

      MockModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockInvoices),
      });

      const result = await service.findAll(start, end);

      expect(result).toEqual(mockInvoices);
      expect(MockModel.find).toHaveBeenCalledWith({
        date: {
          $gte: new Date(start),
          $lte: new Date(end),
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return an invoice when it exists', async () => {
      MockModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockInvoice),
      });

      const result = await service.findOne(mockInvoice._id);

      expect(result).toEqual(mockInvoice);
      expect(MockModel.findById).toHaveBeenCalledWith(mockInvoice._id);
    });

    it('should throw EntityNotFoundException when invoice does not exist', async () => {
      MockModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(
        EntityNotFoundException,
      );
    });
  });
});

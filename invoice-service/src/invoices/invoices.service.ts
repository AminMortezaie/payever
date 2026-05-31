import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { EntityNotFoundException } from '../common/exceptions/entity-not-found.exception';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const createdInvoice = new this.invoiceModel({
      ...createInvoiceDto,
      date: new Date(createInvoiceDto.date),
    });
    return createdInvoice.save();
  }

  async findAll(start?: string, end?: string): Promise<Invoice[]> {
    const filter: any = {};
    if (start && end) {
      filter.date = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }
    return this.invoiceModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findById(id).exec();
    if (!invoice) {
      throw new EntityNotFoundException('Invoice', id);
    }
    return invoice;
  }
}

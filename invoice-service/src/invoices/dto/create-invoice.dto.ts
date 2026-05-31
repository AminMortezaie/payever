import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDate,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class InvoiceItemDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  @IsNotEmpty()
  qt: number;
}

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  customer: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];
}

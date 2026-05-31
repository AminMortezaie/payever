import { IsOptional, IsString } from 'class-validator';

export class FindAllInvoicesDto {
  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}

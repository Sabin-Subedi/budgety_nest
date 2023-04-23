import { TransactionType } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsDateString()
  @IsNotEmpty()
  transaction_date: Date;

  @IsNotEmpty()
  @IsString()
  transaction_type: TransactionType;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsString()
  description: string;

  @IsString()
  note: string;
}

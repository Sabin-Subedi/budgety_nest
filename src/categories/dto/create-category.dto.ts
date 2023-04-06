import { TransactionType } from '@prisma/client';
import { IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Min(3)
  name: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  type: TransactionType;
}

import { TransactionType } from '@prisma/client';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  type: TransactionType;
}

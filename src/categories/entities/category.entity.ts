import { Category as CategorySchema, TransactionType } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class CategoryEntity implements CategorySchema {
  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }

  id: string;
  name: string;
  @Exclude()
  deletedAt: Date | null;
  type: TransactionType;
  description: string;
  created_at: Date;
  userId: string;
}

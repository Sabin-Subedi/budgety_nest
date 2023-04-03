import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  id: string;
  email: string;
  name: string;
  username: string;

  @Exclude()
  password: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  is_deleted: boolean;
  @Exclude()
  deleted_at: Date;
  @Exclude()
  lastLogin: Date;
  @Exclude()
  active: boolean;

  created_at: Date;
}

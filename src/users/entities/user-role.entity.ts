import { User } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';

export class UserRoleEntity implements User {
  constructor(partial: Partial<UserRoleEntity>) {
    Object.assign(this, partial);
    this.user_permission = partial?.UserRoles;
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

  @Exclude()
  roleId: string;

  @Exclude()
  Profile: object;

  @Exclude()
  UserRoles: Array<object>;

  @Transform((value) => {
    const user_permission = [];
    value.forEach((userRole) => {
      userRole.Role.RolePermissions.forEach((rolePermission) => {
        user_permission.push([
          rolePermission.Permission.url,
          rolePermission.Permission.method,
        ]);
      });
    });

    return user_permission;
  })
  user_permission: Array<object>;

  created_at: Date;
}

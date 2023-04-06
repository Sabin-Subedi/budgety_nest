import { CATEGORIES_API } from './permissions';

export enum Role {
  Admin = 'admin',
  Client = 'client',
}

export const RolePermissionMap = {
  [Role.Admin]: ['*'],
  [Role.Client]: [CATEGORIES_API],
};

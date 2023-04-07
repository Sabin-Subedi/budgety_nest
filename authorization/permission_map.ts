import { CATEGORIES_API } from './permissions';
import { Role } from './roles';

export const RolePermissionMap = {
  [Role.Admin]: ['*'],
  [Role.Client]: [CATEGORIES_API],
};

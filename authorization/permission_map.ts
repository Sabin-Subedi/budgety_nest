import { CATEGORIES_API, USERS_API } from './permissions';
import { Role } from './roles';

export const RolePermissionMap = {
  [Role.Admin]: ['*'],
  [Role.Client]: [CATEGORIES_API, USERS_API],
};

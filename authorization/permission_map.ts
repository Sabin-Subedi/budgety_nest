import {
  CATEGORIES_API,
  COMPOSITE_API,
  TRANSACTIONS_API,
  USERS_API,
} from './permissions';
import { Role } from './roles';

export const RolePermissionMap = {
  [Role.Admin]: ['*'],
  [Role.Client]: [CATEGORIES_API, USERS_API, COMPOSITE_API, TRANSACTIONS_API],
};

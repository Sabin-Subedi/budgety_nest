import { PrismaClient } from '@prisma/client';
import { RolePermissionMap } from '../authorization/permission_map';
import * as Permissions from '../authorization/permissions';
const prisma = new PrismaClient();

function getPermissionsArray(permission: string[][]) {
  const permissions = [];
  permission.forEach((role) => {
    permissions.push({
      url: role[0],
      method: role[1],
    });
  });
  return permissions;
}

async function createPermission() {
  await prisma.permission.deleteMany();
  console.log('Deleted all permissions');

  const permissions = [];
  Object.values(Permissions).forEach((permission) => {
    permissions.push(...getPermissionsArray(permission));
  });

  const createdPermission = await prisma.permission.createMany({
    data: permissions,
  });

  console.log('Created permissions ............');

  console.log(createdPermission);
}

async function assignPermissionToRole() {
  const roles = await prisma.role.findMany();
  const permissions = await prisma.permission.findMany({});
  const rolePerms = [];

  Object.keys(RolePermissionMap).forEach((role) => {
    const rolePermissionMap = RolePermissionMap[role];
    const roleRecord = roles.find((r) => r.name === role);
    if (rolePermissionMap.includes('*')) {
      permissions.forEach((permission) => {
        rolePerms.push({
          roleId: roleRecord.id,
          permissionId: permission.id,
        });
      });
    } else {
      rolePermissionMap.forEach((perm: string[][]) => {
        const perms = getPermissionsArray(perm);
        perms.forEach((p) => {
          const permission = permissions.find(
            (perm) => perm.url === p.url && perm.method === p.method,
          );
          rolePerms.push({
            roleId: roleRecord.id,
            permissionId: permission.id,
          });
        });
      });
    }
  });
  console.log('Assigning permissions to roles...');

  await prisma.rolePermissions.deleteMany();
  console.log('Deleted all role permissions');

  console.log(rolePerms);

  const createdRolePerms = await prisma.rolePermissions.createMany({
    data: rolePerms,
  });

  console.log(`Created ${createdRolePerms.count} role permissions`);
}

(async function updatePermission() {
  try {
    await prisma.$connect();
    await createPermission();
    await assignPermissionToRole();
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
  }
})();

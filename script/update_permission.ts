import { PrismaClient } from '@prisma/client';
import { Role } from '../authorization/roles';
import * as Permissions from '../authorization/permissions';
const prisma = new PrismaClient();

async function createPermission() {
  await prisma.permission.deleteMany();
  console.log('Deleted all permissions');

  const permissions = [];
  Object.values(Permissions).forEach((permission) => {
    permission.forEach((role) => {
      permissions.push({
        url: role[0],
        method: role[1],
      });
    });
  });

  const createdPermission = await prisma.permission.createMany({
    data: permissions,
  });

  console.log('Created permissions ............');

  console.log(createdPermission);
}

async function assignPermissionToRole() {
  const roles = await prisma.role.findMany();
  const permissions = await prisma.permission.findMany();

  console.log('Assigning permissions to roles...');
}

(async function updatePermission() {
  try {
    await prisma.$connect();
    await createPermission();
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
  }
})();

import { PrismaClient } from '@prisma/client';
import { Role } from '../authorization/roles';
const prisma = new PrismaClient();

(async function loadBuiltInRoles() {
  const roles: Role[] = [];
  for (const role of Object.values(Role)) {
    roles.push(role);
  }

  await prisma.role.createMany({
    data: roles.map((role) => ({
      name: role,
    })),
  });
})();

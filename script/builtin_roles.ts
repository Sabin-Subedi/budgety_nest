import { PrismaClient } from '@prisma/client';
import { Role } from '../authorization/roles';
const prisma = new PrismaClient();

(async function loadBuiltInRoles() {
  const roles: Role[] = [];

  const loadedRoles = await prisma.role.findMany();

  for (const role of Object.values(Role)) {
    roles.push(role);
  }

  loadedRoles.forEach((role) => {
    const index = roles.indexOf(role.name as Role);
    if (index > -1) {
      roles.splice(index, 1);
    }
  });

  await prisma.role.createMany({
    data: roles.map((role) => ({
      name: role,
    })),
  });
})();

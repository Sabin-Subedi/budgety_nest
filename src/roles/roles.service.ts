import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.role.findMany();
  }

  findOne(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  findMyRole() {
    return this.prisma.role.findMany();
  }

  async assignRoleToUser(userId: string, rolesToAssign: string[]) {
    const roles = await this.prisma.role.findMany();
    const data = roles
      .filter((role) => rolesToAssign.includes(role.name))
      .map((role) => ({
        userId,
        roleId: role.id,
      }));

    const userRoles = await this.prisma.userRoles.createMany({
      data,
    });

    return userRoles;
  }
}

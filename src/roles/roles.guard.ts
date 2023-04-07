import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    console.log(user);
    if (!user?.sub) {
      return false;
    }

    const userData = await this.prisma.user.findUnique({
      where: {
        id: user.sub,
      },
      include: {
        UserRoles: true,
      },
    });

    const roles = await this.prisma.rolePermissions.findMany({
      include: {
        Permission: true,
      },
    });

    const currentUserRoles = userData.UserRoles.map((userRole) =>
      roles.filter((role) => role.roleId === userRole.roleId),
    )
      .reduce((acc, val) => acc.concat(val), [])
      .reduce((acc, val) => acc.concat(val.Permission), []);

    return true;
  }
}

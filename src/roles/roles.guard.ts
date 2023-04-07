import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@permissions';
import { PrismaService } from 'nestjs-prisma';
import { getUrlPermission } from 'src/utils/default';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private prisma: PrismaService, private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user?.sub) {
      throw new UnauthorizedException(
        "You don't have permission to perform this action",
      );
    }

    const [urlName, handlerName] = this.reflector.getAll(PATH_METADATA, [
      context.getClass(),
      context.getHandler(),
    ]);

    const currentUrlPermission = getUrlPermission(
      urlName,
      handlerName,
      req.method,
    );

    const userData = await this.prisma.user.findUnique({
      where: {
        id: user.sub,
      },
      include: {
        UserRoles: {
          include: {
            Role: {
              include: {
                RolePermissions: {
                  include: {
                    Permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const userPermissions = [];
    userData.UserRoles.forEach((userRole) => {
      userRole.Role.RolePermissions.forEach((rolePermission) => {
        userPermissions.push([
          rolePermission.Permission.url,
          rolePermission.Permission.method,
        ]);
      });
    });

    const isAllowed = userPermissions.some((permission) => {
      return permission.join('') === currentUrlPermission.join('');
    });

    if (!isAllowed)
      throw new UnauthorizedException(
        "You don't have permission to perform this action",
      );

    return isAllowed;
  }
}

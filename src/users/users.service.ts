import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { OAuthUserDto } from './dto/create-oauth-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      where: {
        active: true,
        is_deleted: false,
      },
    });
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  findOne(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  getUserCompleteProfile(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        Profile: true,
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
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (user?.is_deleted) throw new HttpException('User Not Found', 404);

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    });
  }
}

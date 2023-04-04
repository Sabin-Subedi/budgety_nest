import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'nestjs-prisma';

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

  findOne(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    console.log('slkjkds');
    return this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
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

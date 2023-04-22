import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from '@types';
import { PrismaService } from 'nestjs-prisma';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable({})
export class CategoriesService {
  authenticatedUserId = this.request?.user?.sub || null;
  constructor(
    private prisma: PrismaService,
    @Inject(REQUEST) private request: Request,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const userId = this.request.user.sub;
    if (!userId) throw new UnauthorizedException('Bad request');
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        userId,
      },
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      where: {
        userId: this.request.user.sub,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        ...updateCategoryDto,
      },
    });
  }

  remove(id: string) {
    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}

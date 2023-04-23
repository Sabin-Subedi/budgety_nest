import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from '@types';
import { PrismaService } from 'nestjs-prisma';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    @Inject(REQUEST) private request: Request,
  ) {}
  create(createTransactionDto: CreateTransactionDto) {
    const userId = this.request.user.sub;
    if (!userId) throw new UnauthorizedException('Bad request');
    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        userId,
      },
    });
  }

  findAll() {
    const authId = this.request.user.sub;
    return authId
      ? this.prisma.transaction.findMany({
          where: {
            userId: authId,
          },
        })
      : [];
  }

  async findOne(id: string) {
    const data = await this.prisma.transaction.findUnique({
      where: {
        id,
      },
    });

    if (data.userId !== this.request.user.sub) {
      return null;
    }
    return data;
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: string) {
    return `This action removes a #${id} transaction`;
  }
}

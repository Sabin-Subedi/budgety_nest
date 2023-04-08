import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { UserRoleEntity } from './entities/user-role.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOkResponse({ type: [UserEntity] })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => {
      return new UserEntity(user);
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  @ApiOkResponse({ type: UserRoleEntity })
  async getMe(@Request() request) {
    return new UserRoleEntity(
      await this.usersService.getUserCompleteProfile(request.user.sub),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (user.active === false || user.is_deleted === true)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return new UserEntity(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  @ApiCreatedResponse({ type: UserEntity })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return {
      message: 'User deleted successfully',
    };
  }
}

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return new CategoryEntity(
      await this.categoriesService.create(createCategoryDto),
    );
  }

  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return categories.map((category) => {
      return new CategoryEntity(category);
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return new CategoryEntity(await this.categoriesService.findOne(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return new CategoryEntity(
      await this.categoriesService.update(id, updateCategoryDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return new CategoryEntity(await this.categoriesService.remove(id));
  }
}

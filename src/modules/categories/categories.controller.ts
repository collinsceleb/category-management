import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create-root-category')
  async createRootCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.createRootCategory(createCategoryDto);
  }

  @Post('add-child-category')
  async addChildCategory(
    @Body() body: { categories: { name: string; parentId: number }[] },
  ) {
    return this.categoriesService.addChildCategory(body.categories);
  }
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}

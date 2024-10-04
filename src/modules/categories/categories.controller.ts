import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { MoveCategorySubtreeDto } from './dto/move-category-subtree.dto';

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

  @Get(':id')
  async fetchCategorySubtree(@Param('id') id: number) {
    return this.categoriesService.fetchCategorySubtree(id);
  }

  @Patch(':categoryId/move-category-subtree')
  async moveCategorySubtree(
    @Param('categoryId') categoryId: number,
    @Body() moveCategorySubtreeDto: MoveCategorySubtreeDto,
  ) {
    return this.categoriesService.moveCategorySubtree(
      categoryId,
      moveCategorySubtreeDto,
    );
  }
  @Delete(':categoryId/remove')
  async removeCategory(
    @Param('categoryId') categoryId: number,
  ) {
    return this.categoriesService.removeCategory(
      categoryId
    );
  }
}

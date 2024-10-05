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
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';

@Controller('categories')
@ApiTags('categories')
/**
 * Controller class for managing categories
 */
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create-root-category')
  @ApiBody({ type: CreateCategoryDto })
  /**
   * Create a root category
   * @param createCategoryDto - The category data
   * @returns The created category
   */
  async createRootCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.createRootCategory(createCategoryDto);
  }

  @Post('add-sub-category')
  async addSubCategory(
    @Body()
    createSubCategoryDto: {
      categories: { name: string; parentId: number }[];
    },
  ) {
    return this.categoriesService.addSubCategory(
      createSubCategoryDto.categories,
    );
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
  async removeCategory(@Param('categoryId') categoryId: number) {
    return this.categoriesService.removeCategory(categoryId);
  }
}

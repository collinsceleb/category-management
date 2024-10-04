import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly configService: ConfigService,
  ) {}
  async createRootCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      category.name = createCategoryDto.name;
      const savedCategory = await this.categoryRepository.save(category);
      return savedCategory;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create category: ${error.message}`,
      );
    }
  }

  async addChildCategory(categories: CreateSubCategoryDto[]): Promise<Category[]> {
    try {
      const childCategories: Category[] = [];

      console.log(this.configService.get<number>('PORT'));
      

      for (const category of categories) {
        const parentId = category.parentId;
        const parent = await this.categoryRepository.findOne({
          where: { id: parentId },
        });
        console.log('parent', parent);
        if (!parent) {
          throw new Error(
            `Parent category with ID ${category.parentId} not found`,
          );
        }

        const newCategory = this.categoryRepository.create({
          name: category.name,
          parent: parent,
        });

        childCategories.push(newCategory);
      }

      // Perform batch insert
      const savedChildCategory = this.categoryRepository.save(childCategories);
      return savedChildCategory;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create child category: ${error.message}`,
      );
    }
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}

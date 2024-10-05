import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { MoveCategorySubtreeDto } from './dto/move-category-subtree.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
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

  async addSubCategory(
    categories: CreateSubCategoryDto[],
  ): Promise<Category[]> {
    try {
      const childCategories: Category[] = [];

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
  /**
   * Implementt PostgreSQL Recursive Common Table Expression (CTE) using TypeORM as Object Relational Mapper(ORM)
   * to retrieve a hierarchical representation of categories,
   * including their children and potentially further descendants.
   * @param parentId
   * @returns Array of categories with descendants
   */
  async fetchCategorySubtree(parentId: number): Promise<Category[]> {
    try {
      // Create a map for a lookup
      const categoryMap = new Map();
      const treeCategories: Category[] = [];
      const query = `
      WITH RECURSIVE category_tree AS (
        SELECT * FROM category WHERE id = $1
        UNION
        SELECT c.* FROM category c
        INNER JOIN category_tree ct ON c.parent_id = ct.id
      )
      SELECT * FROM category_tree;
    `;
      const categories = await this.categoryRepository.query(query, [parentId]);

      // Build a map for quick lookup
      categories.forEach((category: Category) => {
        categoryMap.set(category.id, category);
      });

      // Assign parents to children and identify root categories
      categories.forEach((category) => {
        if (category.parent_id) {
          const parent = categoryMap.get(category.parent_id) as Category;
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(category);
        } else {
          treeCategories.push(category);
        }
      });

      return treeCategories;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch category subtree: ${error.message}`,
      );
    }
  }

  
  async removeCategory(categoryId: number): Promise<{ deleted: boolean }> {
    try {
      await this.categoryRepository.delete(categoryId);
      return { deleted: true };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to remove category: ${error.message}`,
      );
    }
  }
  
  async moveCategorySubtree(
    categoryId: number,
    moveCategorySubtreeDto: MoveCategorySubtreeDto,
  ): Promise<Category> {
    try {
      const { newParentId } = moveCategorySubtreeDto;
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
        relations: ['parent'],
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
      // Find the new parent category
      const newParent = await this.categoryRepository.findOne({
        where: { id: newParentId },
      });
      if (!newParent) {
        throw new NotFoundException('New parent category not found');
      }
      // Check if the move would create a circular dependency
      const CreateCircular = await this.checkDescendant(
        categoryId,
        newParentId,
      );
console.log(newParentId);
console.log(categoryId);
console.log('categcategory.parent.idoryId', category.parent.id);
console.log(CreateCircular);
      if (CreateCircular) {
        throw new BadRequestException(
          'Cannot move a category under itself or its descendants',
        );
      }
      // Update the parent of the category
      category.parent = newParent;
      // Save the updated category
      const savedCategory = await this.categoryRepository.save(category);

      return savedCategory;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while moving the category',
        error,
      );
    }
  }
  private async checkDescendant(
    categoryId: number,
    newParentId: number,
  ): Promise<boolean> {
    let currentCategory = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['parent'],
    });

    // Traverse up the tree from the new parent
    while (currentCategory) {
      if (currentCategory.parent) {

        if (currentCategory.parent.id === newParentId) {
          throw new BadRequestException(
            'Cannot move a category under one of its descendants',
          );
        }
      }
      // Moving to the same category becomes circular
      if (currentCategory.id === newParentId) {
        throw new BadRequestException('Cannot move a category under itself');
      }
      // Move up the tree to the parent
      currentCategory = currentCategory.parent;
    }

    return false;
  }
}

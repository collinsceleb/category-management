import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { MoveCategorySubtreeDto } from './dto/move-category-subtree.dto';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { Category } from './entities/category.entity';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            createRootCategory: jest.fn(),
            addSubCategory: jest.fn(),
            moveCategorySubtree: jest.fn(),
            fetchCategorySubtree: jest.fn(),
            removeCategory: jest.fn(),
          },
        },
      ],
    }).compile();

    categoriesController =
      module.get<CategoriesController>(CategoriesController);
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
  });

  describe('createRootCategory', () => {
    it('should call create root category and return a category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };
      const result = { id: 1, ...createCategoryDto } as Category;

      jest
        .spyOn(categoriesService, 'createRootCategory')
        .mockResolvedValue(result);

      expect(
        await categoriesController.createRootCategory(createCategoryDto),
      ).toBe(result);
    });
  });

  describe('addSubCategory', () => {
    it('should call add child category as sub category and return the child category', async () => {
      const createSubCategoryDto = { categories: [{
        name: 'Child Category',
        parentId: 1, }]
      };
      const result = { id: 2, name: 'Sub Category', parentId: 1 } as unknown  as Category[];

      jest.spyOn(categoriesService, 'addSubCategory').mockResolvedValue(result);

      expect(
        await categoriesController.addSubCategory(createSubCategoryDto),
      ).toBe(result);
    });
  });

  describe('moveCategorySubtree', () => {
    it('should call move category subtree and return the updated category', async () => {
      const categoryId = 2;
      const moveCategoryDto: MoveCategorySubtreeDto = {
        newParentId: 2,
      };
      const result = { id: 1, name: 'Moved Category', parentId: 2 } as unknown as Category;

      jest
        .spyOn(categoriesService, 'moveCategorySubtree')
        .mockResolvedValue(result);

      expect(
        await categoriesController.moveCategorySubtree(
          categoryId, moveCategoryDto,
        ),
      ).toBe(result);
    });
  });

   describe('removeCategory', () => {
     it('should remove a category', async () => {
       const categoryId = 1;

       jest
         .spyOn(categoriesService, 'removeCategory')
         .mockResolvedValue({ deleted: true });

       const result = await categoriesController.removeCategory(categoryId);
       expect(result).toEqual({ deleted: true });
       expect(categoriesService.removeCategory).toHaveBeenCalledWith(
         categoryId,
       );
     });
   });

   describe('fetchCategorySubtree', () => {
     it('should return a category subtree', async () => {
       const subtree = [
         { id: 1, name: 'Parent', parentId: null },
         { id: 2, name: 'Child', parentId: 1 },
       ] as unknown as Category[];
       const parentId = 1;

       jest
         .spyOn(categoriesService, 'fetchCategorySubtree')
         .mockResolvedValue(subtree);

       const result = await categoriesController.fetchCategorySubtree(parentId);
       expect(result).toEqual(subtree);
       expect(categoriesService.fetchCategorySubtree).toHaveBeenCalledWith(
         parentId,
       );
     });
   });
});

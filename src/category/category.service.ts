import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CategoryChangeDto, CategorySearchDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async addCategory(category: string) {
    console.log(category);
    const oldCategory = await this.categoryRepository.findOneBy({
      value: category,
    });

    if (oldCategory)
      throw new BadRequestException('Такая категория уже существует');

    const newCategory = this.categoryRepository.create({
      value: category,
    });

    return this.categoryRepository.save(newCategory);
  }

  async getCategories(query: CategorySearchDto) {
    if (query.search) {
      return this.categoryRepository.find({
        where: {
          value: ILike(`%${query.search}%`),
        },
        select: {
          id: true,
          value: true,
        },
      });
    } else {
      return this.categoryRepository.find({
        select: {
          id: true,
          value: true,
        },
      });
    }
  }

  async deleteCategory(categoryId: number) {
    return this.categoryRepository.delete(categoryId);
  }

  async changeCategory(query: CategoryChangeDto) {
    const category = await this.categoryRepository.findOneBy({
      id: query.categoryId,
    });

    category.value = query.value;

    return this.categoryRepository.save(category);
  }
}

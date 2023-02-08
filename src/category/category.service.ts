import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getAllCategories(search: string = '') {
    return await this.categoryRepository.findBy({
      value: Like(`%${search}%`),
    });
  }

  async getCurrentCategory(categoryId: number) {
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (!category) throw new NotFoundException('Такой категории не существует');

    return category;
  }

  async createCategory(value: string) {
    const oldCategory = await this.categoryRepository.findOneBy({
      value: value,
    });

    if (oldCategory)
      throw new BadRequestException(
        'Категория с таким названием уже существует',
      );

    const newCategory = this.categoryRepository.create({
      value: value,
    });

    return this.categoryRepository.save(newCategory);
  }

  async updateCategory(categoryId: number, value: string) {
    const oldCategory = await this.categoryRepository.findOneBy({
      value: value,
    });

    if (oldCategory)
      throw new BadRequestException(
        'Категория с таким названием уже существует',
      );

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (!category) throw new NotFoundException('Такой категории не существует');

    category.value = value;

    return this.categoryRepository.save(category);
  }

  async destroyCategory(categoryId: number) {
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (!category) throw new NotFoundException('Такой категории не существует');

    return await this.categoryRepository.remove(category);
  }
}

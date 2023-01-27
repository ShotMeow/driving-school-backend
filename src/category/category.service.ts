import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async addCategory(dto: CategoryDto) {
    const newCategory = this.categoryRepository.create({
      category: dto.category,
    });

    return this.categoryRepository.save(newCategory);
  }

  async getCategories() {
    return this.categoryRepository.find({
      select: {
        id: true,
        category: true,
      },
    });
  }
}

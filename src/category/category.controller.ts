import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  async createCategory(@Body() dto: CategoryDto) {
    return this.categoryService.addCategory(dto);
  }

  @Get('categories')
  async getCategories() {
    return this.categoryService.getCategories();
  }
}

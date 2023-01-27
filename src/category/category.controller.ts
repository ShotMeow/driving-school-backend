import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Post('create')
  async createCategory(@Body() dto: CategoryDto) {
    return this.categoryService.addCategory(dto);
  }

  @Get('categories')
  async getCategories() {
    return this.categoryService.getCategories();
  }
}

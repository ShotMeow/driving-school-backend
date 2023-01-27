import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/enums/userType.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/role.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Post('create')
  async createCategory(@Body() dto: CategoryDto) {
    return this.categoryService.addCategory(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('categories')
  async getCategories() {
    return this.categoryService.getCategories();
  }
}

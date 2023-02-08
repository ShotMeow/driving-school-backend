import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/enums/userType.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/role.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async index(@Query('search') search: string) {
    return this.categoryService.getAllCategories(search);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Put('create')
  async create(@Body('value') value: string) {
    return this.categoryService.createCategory(value);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':categoryId')
  async show(@Param('categoryId') categoryId: number) {
    return this.categoryService.getCurrentCategory(categoryId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':categoryId')
  async update(
    @Param('categoryId') categoryId: number,
    @Body('value') value: string,
  ) {
    return this.categoryService.updateCategory(categoryId, value);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':categoryId')
  async destroy(@Param('categoryId') categoryId: number) {
    return this.categoryService.destroyCategory(categoryId);
  }
}

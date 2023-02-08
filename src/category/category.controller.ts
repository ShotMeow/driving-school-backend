import {
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { CategoryChangeDto, CategorySearchDto } from './dto/category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Put('create')
  async createCategory(@Query('category') category: string) {
    return this.categoryService.addCategory(category);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getCategories(@Query() query: CategorySearchDto) {
    return this.categoryService.getCategories(query);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('delete')
  async deleteCategory(@Query('categoryId') categoryId: number) {
    return this.categoryService.deleteCategory(categoryId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('change')
  async changeCategory(@Query() query: CategoryChangeDto) {
    return this.categoryService.changeCategory(query);
  }
}

import {
  Controller,
  ExecutionContext,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './enums/userType.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/role.guard';
import { UserDto } from './dto/user.dto';
import { User } from './decorators/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('filter')
  async getUsersByType(@Query() query: UserDto) {
    return this.userService.getUsersByRole(query.role);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  @Patch(':userId')
  async changeUserRole(
    @Param('userId') userId: number,
    @Query() query: UserDto,
  ) {
    return this.userService.changeUserRole(userId, query.role);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getCurrentUser(@User() user) {
    return this.userService.getUserProfile(user.id);
  }
}

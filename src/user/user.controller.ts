import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':userRole')
  async getUsersByType(@Param('userRole') role: Role) {
    return this.userService.getUsersByRole(role);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  @Post(':userId/role')
  async changeUserRole(
    @Param('userId') userId: number,
    @Body('role') dto: UserDto,
  ) {
    return this.userService.changeUserRole(userId, dto.role);
  }
}

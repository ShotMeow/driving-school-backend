import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './enums/userType.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/role.guard';

@Controller('user')
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
  @Get(':type')
  async getUsersByType(@Param() params: { role: Role }) {
    return this.userService.GetUsersByRole(params.role);
  }
}

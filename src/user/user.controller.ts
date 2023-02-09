import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './enums/userType.enum';
import { User } from './decorators/user.decorator';
import { ChangeRoleDto } from './dto/changeRole.dto';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async index(
    @Query()
    query: {
      search: string;
      role: Role;
      withGroup: 'true' | 'false';
    },
  ) {
    return this.userService.getAllUsers(
      query.search,
      query.role,
      query.withGroup,
    );
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':userId')
  async changeUserRole(
    @Param('userId') userId: number,
    @Body() body: ChangeRoleDto,
  ) {
    return this.userService.changeUserRole(userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getAuthUser(@User() user) {
    return this.userService.getAuthUser(user.id);
  }
}

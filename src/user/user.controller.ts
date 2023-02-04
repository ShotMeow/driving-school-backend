import {
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
  async getUsersByRoleAndSearchTerm(@Query() query: UserDto) {
    return this.userService.getUsersByRoleAndSearchTerm(query);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('students')
  async getStudentsWithGroup(@Query() search: string) {
    return this.userService.getStudentsWithGroup(search);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('students/without')
  async getStudentsWithoutGroup() {
    return this.userService.getStudentsWithoutGroup();
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
  async getAuthUser(@User() user) {
    return this.userService.getAuthUser(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile/group')
  async getGroupByAuthUser(@User() user) {
    return this.userService.getGroupByUserId(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile/group/:userId')
  async getGroupByUserId(@Param('userId') userId: number) {
    return this.userService.getGroupByUserId(userId);
  }
}

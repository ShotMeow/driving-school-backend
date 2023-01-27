import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserType } from './enums/userType.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':type')
  async getUsersByType(@Param() type: { type: UserType }) {
    return this.userService.GetUsersByType(type.type);
  }
}

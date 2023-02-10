import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/enums/userType.enum';
import { CreateGroupDto } from './dto/createGroup.dto';
import { UpdateGroupDto } from './dto/updateGroup.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async index(@Query('search') search: string) {
    return this.groupService.getAllGroups(search);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('create')
  async create(@Body() body: CreateGroupDto) {
    return this.groupService.createGroup(body);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':groupId')
  async show(@Param('groupId') groupId: number) {
    return this.groupService.getGroupById(groupId);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':groupId')
  async update(
    @Param('groupId') groupId: number,
    @Body() body: UpdateGroupDto,
  ) {
    return this.groupService.updateGroup(groupId, body);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':groupId')
  async destroy(@Param('groupId') groupId: number) {
    return this.groupService.destroyGroup(groupId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':groupId/:userId')
  async pushStudentToGroup(
    @Param() params: { groupId: number; userId: number },
  ) {
    return this.groupService.pushStudentToGroup(params.groupId, params.userId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':groupId/:userId')
  async destroyStudentFromGroup(
    @Param() params: { groupId: number; userId: number },
  ) {
    return this.groupService.destroyStudentFromGroup(
      params.groupId,
      params.userId,
    );
  }
}

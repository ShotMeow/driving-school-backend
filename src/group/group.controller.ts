import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChangeTeacherDto, GroupDto } from './dto/group.dto';
import { GroupService } from './group.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/enums/userType.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/role.guard';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllGroups() {
    return this.groupService.getAllGroups();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Post('create')
  async createGroup(@Body() dto: GroupDto) {
    return this.groupService.createGroup(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('change')
  async changeTeacher(@Body() dto: ChangeTeacherDto) {
    return this.groupService.changeTeacher(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  async getSchedulesByGroupId(@Param() groupId: { id: number }) {
    return this.groupService.getSchedulesByGroupId(groupId.id);
  }
}

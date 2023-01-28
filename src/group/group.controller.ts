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
import { GroupDto } from './dto/group.dto';
import { GroupService } from './group.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/enums/userType.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/role.guard';
import { TeacherType } from './dto/enums/teacherType.enum';
import { ParamsInterface } from './interfaces/params.interface';

@Controller('groups')
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
  @Post(':groupId/:teacherId')
  async changeTeacher(
    @Param() params: ParamsInterface,
    @Body('teacherType') teacherType: TeacherType,
  ) {
    return this.groupService.changeTeacher(params, teacherType);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':groupId')
  async getSchedulesByGroupId(@Param('id') id: number) {
    return this.groupService.getSchedulesByGroupId(id);
  }
}

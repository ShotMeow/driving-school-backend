import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Put,
  Query,
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
  async getGroupsBySearchTerm(@Query() query: { search: string }) {
    return this.groupService.getGroupsBySearchTerm(query);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Put('create')
  async createGroup(@Body() dto: GroupDto) {
    return this.groupService.createGroup(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Patch(':groupId/:teacherId')
  async changeTeacher(
    @Param() params: ParamsInterface,
    @Body('teacherType') teacherType: TeacherType,
  ) {
    return this.groupService.changeTeacher(params, teacherType);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':groupId')
  async getSchedulesByGroupId(@Param('groupId') id: number) {
    return this.groupService.getSchedulesByGroupId(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Put('create/student/:groupId/:studentId')
  async addStudentToGroup(
    @Param('groupId') groupId: number,
    @Param('studentId') studentId: number,
  ) {
    return this.groupService.addStudentToGroup(groupId, studentId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('delete/:groupId')
  async deleteGroup(@Param('groupId') groupId: number) {
    return this.groupService.deleteGroup(groupId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('delete/student/:groupId/:studentId')
  async deleteStudentForGroup(
    @Param('groupId') groupId: number,
    @Param('studentId') studentId: number,
  ) {
    return this.groupService.deleteStudentForGroup(groupId, studentId);
  }
}

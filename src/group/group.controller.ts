import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChangeTeacherDto, GroupDto } from './dto/group.dto';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  async getAllGroups() {
    return this.groupService.getAllGroups();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Post('create')
  async createGroup(@Body() dto: GroupDto) {
    return this.groupService.createGroup(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('change')
  async changeTeacher(@Body() dto: ChangeTeacherDto) {
    return this.groupService.changeTeacher(dto);
  }

  @Get(':id')
  async getSchedulesByGroupId(@Param() groupId: { id: number }) {
    return this.groupService.getSchedulesByGroupId(groupId.id);
  }
}

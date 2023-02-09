import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/enums/userType.enum';
import { UpdateScheduleDto } from './dto/updateSchedule.dto';
import { CreateScheduleDto } from './dto/createSchedule.dto';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':groupId')
  async index(@Param('groupId') groupId: number) {
    return this.scheduleService.getScheduleByGroup(groupId);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':groupId/create')
  async create(
    @Param('groupId') groupId: number,
    @Body() body: CreateScheduleDto,
  ) {
    return this.scheduleService.createSchedule(groupId, body);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':groupId/:scheduleId')
  async update(
    @Param() params: { groupId: number; scheduleId: number },
    @Body() body: UpdateScheduleDto,
  ) {
    return this.scheduleService.updateSchedule(params, body);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':groupId/:scheduleId')
  async destroy(@Param() params: { groupId: number; scheduleId: number }) {
    return this.scheduleService.destroySchedule(params);
  }
}

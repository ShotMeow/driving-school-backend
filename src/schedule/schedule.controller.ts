import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ScheduleDto } from './dto/schedule.dto';
import { ScheduleService } from './schedule.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/enums/userType.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/role.guard';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Put('create/:groupId')
  async createSchedule(
    @Param('groupId') groupId: number,
    @Body() dto: ScheduleDto,
  ) {
    return this.scheduleService.createSchedule(groupId, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteSchedule(@Param('id') id: number) {
    console.log(id);
    return this.scheduleService.deleteSchedule(id);
  }
}

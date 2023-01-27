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
import { ScheduleDto } from './dto/schedule.dto';
import { ScheduleService } from './schedule.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/enums/userType.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/role.guard';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Post('create')
  async createSchedule(@Body() dto: ScheduleDto) {
    return this.scheduleService.createSchedule(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('delete/:id')
  async deleteSchedule(@Param('id') id: number) {
    return this.scheduleService.deleteSchedule(id);
  }
}

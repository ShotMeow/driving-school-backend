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
import { ScheduleDto } from './dto/schedule.dto';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Post('create')
  async createSchedule(@Body() dto: ScheduleDto) {
    return this.scheduleService.createSchedule(dto);
  }

  @Get('delete/:id')
  async deleteSchedule(@Param('id') id: number) {
    return this.scheduleService.deleteSchedule(id);
  }
}

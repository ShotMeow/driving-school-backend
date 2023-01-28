import { IsString } from 'class-validator';

export class ScheduleDto {
  @IsString()
  weekday: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}

import { IsNumber, IsString } from 'class-validator';

export class ScheduleDto {
  @IsNumber()
  group_id: number;

  @IsString()
  weekday: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}

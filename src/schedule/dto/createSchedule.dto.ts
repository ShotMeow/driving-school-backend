import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { TypeEnum } from '../enums/type.enum';
import { Type } from 'class-transformer';

export class CreateScheduleDto {
  @IsEnum(TypeEnum)
  type: TypeEnum;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsString()
  address?: string;
}

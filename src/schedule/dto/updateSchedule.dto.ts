import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { TypeEnum } from '../enums/type.enum';

export class UpdateScheduleDto {
  @IsOptional()
  @IsEnum(TypeEnum)
  type?: TypeEnum;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  address?: string;
}

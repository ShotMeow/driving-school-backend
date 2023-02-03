import { IsNumber, IsString } from 'class-validator';

export class GroupDto {
  @IsNumber()
  practice_teacher: number;

  @IsNumber()
  theory_teacher: number;

  @IsString()
  category: string;
}

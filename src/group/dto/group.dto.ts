import { IsEnum, IsNumber, IsString } from 'class-validator';
import { TeacherType } from './enums/teacherType.enum';

export class GroupDto {
  @IsNumber()
  practice_teacher: number;

  @IsNumber()
  theory_teacher: number;

  @IsString()
  category: string;
}

export class ChangeTeacherDto {
  @IsNumber()
  group_id: number;

  @IsNumber()
  new_teacher: number;

  @IsString()
  @IsEnum(TeacherType)
  type: 'theory' | 'practice';
}

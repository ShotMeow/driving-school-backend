import { IsNumber } from 'class-validator';

export class CreateGroupDto {
  @IsNumber()
  practice_teacher_id: number;

  @IsNumber()
  theory_teacher_id: number;

  @IsNumber()
  category_id: number;
}

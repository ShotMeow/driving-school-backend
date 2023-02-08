import { IsNumber, IsOptional } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  @IsNumber()
  practice_teacher_id?: number;

  @IsOptional()
  @IsNumber()
  theory_teacher_id?: number;

  @IsOptional()
  @IsNumber()
  category_id?: number;
}

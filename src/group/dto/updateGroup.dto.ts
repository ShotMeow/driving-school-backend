import { IsNumber, IsOptional } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  @IsNumber()
  practiceTeacherId?: number;

  @IsOptional()
  @IsNumber()
  theoryTeacherId?: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}

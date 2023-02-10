import { IsNumber } from 'class-validator';

export class CreateGroupDto {
  @IsNumber()
  practiceTeacherId: number;

  @IsNumber()
  theoryTeacherId: number;

  @IsNumber()
  categoryId: number;
}

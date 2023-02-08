import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CategoryDto {
  @IsString()
  category: string;
}

export class CategorySearchDto {
  @IsOptional()
  @IsString()
  search: string;
}

export class CategoryChangeDto {
  @IsNumber()
  categoryId: number;
  @IsString()
  value: string;
}

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../enums/userType.enum';

export class UserDto {
  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsString()
  search: string;
}

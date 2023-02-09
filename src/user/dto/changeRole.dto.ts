import { IsEnum } from 'class-validator';
import { Role } from '../enums/userType.enum';

export class ChangeRoleDto {
  @IsEnum(Role)
  role: Role;
}

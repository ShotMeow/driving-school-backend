import { IsEnum } from 'class-validator';
import { UserRole } from '../enums/userType.enum';

export class ChangeRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}

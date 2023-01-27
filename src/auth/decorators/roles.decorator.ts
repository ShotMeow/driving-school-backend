import { Role } from '../../user/enums/userType.enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'role';
export const Roles = (role: Role) => SetMetadata(ROLES_KEY, role);

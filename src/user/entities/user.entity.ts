import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../utils/dto.utils';
import { GroupEntity } from '../../group/entities/group.entity';
import { JoinColumn } from 'typeorm';
import { UserRole } from '../enums/userType.enum';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column()
  surname: string;

  @Column()
  name: string;

  @Column({ default: '' })
  patronymic: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'student', enum: UserRole })
  role: UserRole;

  @Column({ default: null, name: 'avatar_path' })
  avatarPath?: string;

  @ManyToOne(() => GroupEntity, (group) => group.students)
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;
}

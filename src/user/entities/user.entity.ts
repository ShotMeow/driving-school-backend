import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../utils/dto.utils';
import { GroupEntity } from '../../group/entities/group.entity';
import { JoinColumn } from 'typeorm';
import { Role } from '../enums/userType.enum';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column()
  surname: string;

  @Column()
  name: string;

  @Column()
  patronymic: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'student', enum: Role })
  role: Role;

  @Column({ default: '', name: 'avatar_path' })
  avatarPath: string;

  @ManyToOne(() => GroupEntity, (group) => group.users)
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;
}

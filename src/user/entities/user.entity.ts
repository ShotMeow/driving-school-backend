import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../utils/dto.utils';
import { GroupEntity } from '../../group/entities/group.entity';
import { JoinColumn } from 'typeorm';

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

  @Column({ select: false })
  password: string;

  @Column({ default: 'student', name: 'user_type' })
  userType: 'admin' | 'teacher' | 'student';

  @Column({ default: '', name: 'avatar_path' })
  avatarPath: string;

  @ManyToOne(() => GroupEntity, (group) => group.users)
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;
}

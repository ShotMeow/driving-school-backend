import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../utils/dto.utils';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('group')
export class GroupEntity extends BaseEntity {
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'practice_teacher' })
  practiceTeacher: UserEntity;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'theory_teacher' })
  theoryTeacher: UserEntity;

  @Column()
  category: 'B' | 'C' | 'CE' | 'D';

  @OneToMany(() => UserEntity, (user) => user.group)
  users: UserEntity[];
}

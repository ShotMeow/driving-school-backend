import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../utils/dto.utils';
import { UserEntity } from '../../user/entities/user.entity';
import { CategoryEntity } from '../../category/entities/category.entity';
import { ScheduleEntity } from '../../schedule/entities/schedule.entity';

@Entity('group')
export class GroupEntity extends BaseEntity {
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'practice_teacher' })
  practiceTeacher: UserEntity;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'theory_teacher' })
  theoryTeacher: UserEntity;

  @OneToOne(() => CategoryEntity)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @OneToMany(() => UserEntity, (user) => user.group)
  students: UserEntity[];

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.group)
  schedules: ScheduleEntity[];
}

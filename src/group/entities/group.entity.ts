import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../utils/dto.utils';
import { UserEntity } from '../../user/entities/user.entity';
import { CategoryEntity } from '../../category/entities/category.entity';
import { ScheduleEntity } from '../../schedule/entities/schedule.entity';

@Entity('group')
export class GroupEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'practice_teacher_id' })
  practiceTeacher: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'theory_teacher_id' })
  theoryTeacher: UserEntity;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @OneToMany(() => UserEntity, (user) => user.group)
  students: UserEntity[];

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.group)
  schedules: ScheduleEntity[];
}

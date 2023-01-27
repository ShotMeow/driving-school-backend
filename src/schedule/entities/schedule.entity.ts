import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../utils/dto.utils';
import { GroupEntity } from '../../group/entities/group.entity';

@Entity('schedule')
export class ScheduleEntity extends BaseEntity {
  @Column()
  weekday: string;

  @Column({ name: 'start_time' })
  startTime: string;

  @Column({ name: 'end_time' })
  endTime: string;

  @ManyToOne(() => GroupEntity, (group) => group.schedules)
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;
}

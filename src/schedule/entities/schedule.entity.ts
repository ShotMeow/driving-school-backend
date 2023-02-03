import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../utils/dto.utils';
import { GroupEntity } from '../../group/entities/group.entity';
import { TypeEnum } from '../enums/type.enum';

@Entity('schedule')
export class ScheduleEntity extends BaseEntity {
  @Column()
  weekday: string;

  @Column({ enum: TypeEnum })
  type: TypeEnum;

  @Column()
  date: Date;

  @Column({ name: 'start_time' })
  startTime: string;

  @Column({ name: 'end_time' })
  endTime: string;

  @Column({ default: null })
  address?: string;

  @ManyToOne(() => GroupEntity, (group) => group.schedules)
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;
}

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../utils/dto.utils';
import { GroupEntity } from '../../group/entities/group.entity';
import { TypeEnum } from '../enums/type.enum';

@Entity('schedule')
export class ScheduleEntity extends BaseEntity {
  @Column({ enum: TypeEnum })
  type: TypeEnum;

  @Column({ name: 'start_time' })
  startTime: string;

  @Column({ name: 'end_time' })
  endTime: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ default: null })
  address?: string;

  @ManyToOne(() => GroupEntity, (group) => group.schedules)
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;
}

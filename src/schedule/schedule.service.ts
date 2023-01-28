import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleEntity } from './entities/schedule.entity';
import { ScheduleDto } from './dto/schedule.dto';
import { GroupEntity } from '../group/entities/group.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
  ) {}

  async createSchedule(groupId: number, dto: ScheduleDto) {
    const group = await this.groupRepository.findOneBy({
      id: groupId,
    });

    if (!group) throw new NotFoundException('Группа не найдена.');

    const newSchedule = this.scheduleRepository.create({
      ...dto,
      group: group,
    });

    return this.scheduleRepository.save(newSchedule);
  }

  async deleteSchedule(id: number) {
    const schedule = await this.scheduleRepository.findOneBy({
      id: id,
    });

    if (!schedule) throw new NotFoundException('Запись не найдена.');

    await this.scheduleRepository.delete(id);
    return true;
  }
}

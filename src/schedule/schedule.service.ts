import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleEntity } from './entities/schedule.entity';
import { GroupEntity } from '../group/entities/group.entity';
import { UpdateScheduleDto } from './dto/updateSchedule.dto';
import { CreateScheduleDto } from './dto/createSchedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
  ) {}

  async getScheduleByGroup(groupId: number) {
    const schedule = await this.scheduleRepository.find({
      where: {
        group: {
          id: groupId,
        },
      },
    });

    if (!schedule) throw new NotFoundException('Расписание не найдено');

    return schedule;
  }

  async createSchedule(groupId: number, body: CreateScheduleDto) {
    const group = await this.groupRepository.findOneBy({
      id: groupId,
    });

    if (!group) throw new NotFoundException('Такой группы не существует');

    const newSchedule = await this.scheduleRepository.create({
      type: body.type,
      startTime: body.startTime,
      endTime: body.endTime,
      date: body.date,
      address: body.address,
      group: group,
    });

    return await this.scheduleRepository.save(newSchedule);
  }

  async updateSchedule(
    params: { groupId: number; scheduleId: number },
    body: UpdateScheduleDto,
  ) {
    const group = await this.groupRepository.findOneBy({
      id: params.groupId,
    });

    if (!group) throw new NotFoundException('Такой группы не существует');

    const schedule = await this.scheduleRepository.findOneBy({
      id: params.scheduleId,
      group: group,
    });

    if (!schedule) throw new NotFoundException('Расписание не найдено');

    if (body.address) schedule.address = body.address;
    if (body.date) schedule.date = body.date;
    if (body.startTime) schedule.startTime = body.startTime;
    if (body.endTime) schedule.endTime = body.endTime;
    if (body.type) schedule.type = body.type;

    return await this.scheduleRepository.save(schedule);
  }

  async destroySchedule(params: { groupId: number; scheduleId: number }) {
    const group = await this.groupRepository.findOneBy({
      id: params.groupId,
    });

    if (!group) throw new NotFoundException('Такой группы не существует');

    const schedule = await this.scheduleRepository.findOneBy({
      id: params.scheduleId,
      group: group,
    });

    if (!schedule) throw new NotFoundException('Расписание не найдено');

    return await this.scheduleRepository.remove(schedule);
  }
}

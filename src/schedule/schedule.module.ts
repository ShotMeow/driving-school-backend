import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleController } from './schedule.controller';
import { ScheduleEntity } from './entities/schedule.entity';
import { ScheduleService } from './schedule.service';
import { GroupEntity } from '../group/entities/group.entity';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [TypeOrmModule.forFeature([ScheduleEntity, GroupEntity])],
})
export class ScheduleModule {}

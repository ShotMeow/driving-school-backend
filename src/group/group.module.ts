import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ScheduleEntity } from '../schedule/entities/schedule.entity';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [
    TypeOrmModule.forFeature([
      GroupEntity,
      CategoryEntity,
      UserEntity,
      ScheduleEntity,
    ]),
  ],
})
export class GroupModule {}

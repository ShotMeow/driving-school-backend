import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { GroupController } from './group.controller';

@Module({
  controllers: [GroupController],
  providers: [],
  imports: [TypeOrmModule.forFeature([GroupEntity])],
})
export class GroupModule {}

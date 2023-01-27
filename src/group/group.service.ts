import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { Repository } from 'typeorm';
import { ChangeTeacherDto, GroupDto } from './dto/group.dto';
import { UserEntity } from '../user/entities/user.entity';
import { CategoryEntity } from '../category/entities/category.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getAllGroups() {
    return await this.groupRepository.find({
      relations: {
        theoryTeacher: true,
        practiceTeacher: true,
        schedules: true,
      },
    });
  }

  async createGroup(dto: GroupDto) {
    const practiceTeacher = await this.userRepository.findOneBy({
      id: dto.practice_teacher,
    });

    const theoryTeacher = await this.userRepository.findOneBy({
      id: dto.theory_teacher,
    });

    const category = await this.categoryRepository.findOneBy({
      category: dto.category,
    });

    if (!practiceTeacher || !theoryTeacher)
      throw new NotFoundException('Такого пользователя не существует');
    if (!category) throw new NotFoundException('Такой категории не существует');

    const group = await this.groupRepository.create({
      practiceTeacher: practiceTeacher,
      theoryTeacher: theoryTeacher,
      category: category,
    });

    return this.groupRepository.save(group);
  }

  async changeTeacher(dto: ChangeTeacherDto) {
    const group = await this.groupRepository.findOneBy({
      id: dto.group_id,
    });

    if (!group) throw new NotFoundException('Такой группы не существует');

    if (dto.type === 'theory') {
      group.theoryTeacher = await this.userRepository.findOneBy({
        id: dto.new_teacher,
      });
    } else {
      group.practiceTeacher = await this.userRepository.findOneBy({
        id: dto.new_teacher,
      });
    }

    return await this.groupRepository.save(group);
  }

  async getSchedulesByGroupId(groupId: number) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      relations: {
        schedules: true,
      },
    });

    if (!group) throw new NotFoundException('Такой группы не существует');

    return group.schedules;
  }
}

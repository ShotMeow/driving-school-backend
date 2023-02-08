import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { ILike, Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { ScheduleEntity } from '../schedule/entities/schedule.entity';
import { CreateGroupDto } from './dto/createGroup.dto';
import { Role } from '../user/enums/userType.enum';
import { UpdateGroupDto } from './dto/updateGroup.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  async getAllGroups(search: string = '') {
    return await this.groupRepository.find({
      where: [
        {
          theoryTeacher: {
            surname: ILike(`%${search}%`),
          },
        },
        {
          theoryTeacher: {
            name: ILike(`%${search}%`),
          },
        },
        {
          theoryTeacher: {
            patronymic: ILike(`%${search}%`),
          },
        },
        {
          practiceTeacher: {
            surname: ILike(`%${search}%`),
          },
        },
        {
          practiceTeacher: {
            name: ILike(`%${search}%`),
          },
        },
        {
          practiceTeacher: {
            patronymic: ILike(`%${search}%`),
          },
        },
        {
          category: {
            value: ILike(`%${search}%`),
          },
        },
      ],
      loadRelationIds: true,
    });
  }

  async getCurrentGroup(groupId: number) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      loadRelationIds: true,
    });

    if (!group) throw new NotFoundException('Такой группы не существует');

    return group;
  }

  async createGroup(body: CreateGroupDto) {
    const newGroup = await this.groupRepository.create({
      theoryTeacher: await this.getTheoryTeacher(body.theory_teacher_id),
      practiceTeacher: await this.getPracticeTeacher(body.practice_teacher_id),
      category: await this.getCategory(body.category_id),
    });

    return await this.groupRepository.save(newGroup);
  }

  async updateGroup(groupId: number, body: UpdateGroupDto) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      loadRelationIds: true,
    });

    if (!group) throw new NotFoundException('Такой группы не существует');

    if (body.theory_teacher_id)
      group.theoryTeacher = await this.getTheoryTeacher(body.theory_teacher_id);
    if (body.practice_teacher_id)
      group.practiceTeacher = await this.getPracticeTeacher(
        body.practice_teacher_id,
      );
    if (body.category_id)
      group.category = await this.getCategory(body.category_id);

    return group;
  }

  async destroyGroup(groupId: number) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
    });

    if (!group) throw new NotFoundException('Такой группы не существует');

    return this.groupRepository.remove(group);
  }

  async getTheoryTeacher(theoryTeacherId: number) {
    const theoryTeacher = await this.userRepository.findOneBy({
      id: theoryTeacherId,
      role: Role.THEORY_TEACHER,
    });

    if (!theoryTeacher)
      throw new NotFoundException('Такого учителя теории не существует');

    return theoryTeacher;
  }

  async getPracticeTeacher(practiceTeacherId: number) {
    const practiceTeacher = await this.userRepository.findOneBy({
      id: practiceTeacherId,
      role: Role.PRACTICE_TEACHER,
    });

    if (!practiceTeacherId)
      throw new NotFoundException('Такого учителя практики не существует');

    return practiceTeacher;
  }

  async getCategory(categoryId: number) {
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (!category) throw new NotFoundException('Такой категории не существует');

    return category;
  }
}

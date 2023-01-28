import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { Repository } from 'typeorm';
import { GroupDto } from './dto/group.dto';
import { UserEntity } from '../user/entities/user.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { TeacherType } from './dto/enums/teacherType.enum';
import { ParamsInterface } from './interfaces/params.interface';
import { Role } from '../user/enums/userType.enum';
import { ScheduleEntity } from '../schedule/entities/schedule.entity';

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

  async getAllGroups() {
    return await this.groupRepository.find({
      relations: {
        theoryTeacher: true,
        practiceTeacher: true,
        category: true,
        students: true,
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

  async changeTeacher(params: ParamsInterface, teacherType: TeacherType) {
    const group = await this.groupRepository.findOneBy({
      id: params.groupId,
    });

    if (!group) throw new NotFoundException('Такой группы не существует');

    const newTeacher = await this.userRepository.findOneBy({
      id: params.teacherId,
    });

    if (!newTeacher)
      throw new NotFoundException('Такого пользователя не существует');

    if (teacherType === 'theory') {
      group.theoryTeacher = newTeacher;
    } else {
      group.practiceTeacher = newTeacher;
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

  async addStudentToGroup(groupId: number, userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId,
      role: Role.STUDENT,
    });

    if (!user) throw new NotFoundException('Студент не найден');

    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      relations: ['students'],
    });

    if (!group) throw new NotFoundException('Такой группы не существует');

    group.students.push(user);

    return this.groupRepository.save(group);
  }

  async deleteStudentForGroup(groupId: number, userId: number) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      relations: ['students'],
    });

    if (!group) throw new NotFoundException('Такой группы не существует');

    const student = await this.userRepository.findOneBy({
      id: userId,
      role: Role.STUDENT,
    });

    group.students[group.students.indexOf(student) + 1] = null;
    console.log('index', group.students.indexOf(student) + 1);
    return await this.groupRepository.save(group);
  }

  async deleteGroup(groupId: number) {
    const group = await this.groupRepository.findOneBy({
      id: groupId,
    });

    if (!group) throw new NotFoundException('Группа не найдена');

    const schedules = await this.scheduleRepository.find({
      where: {
        group: {
          id: groupId,
        },
      },
    });

    const users = await this.userRepository.find({
      where: {
        group: {
          id: groupId,
        },
      },
    });

    await this.userRepository.remove(users);
    await this.scheduleRepository.remove(schedules);

    return await this.groupRepository.remove(group);
  }
}

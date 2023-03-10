import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import {Any, ILike, Not, Repository} from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { ScheduleEntity } from '../schedule/entities/schedule.entity';
import { CreateGroupDto } from './dto/createGroup.dto';
import { UserRole } from '../user/enums/userType.enum';
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

  async getAllGroups(search = '') {
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
          theoryTeacher: {
            email: ILike(`%${search}%`),
          },
        },
        {
          theoryTeacher: {
            phone: ILike(`%${search}%`),
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
          practiceTeacher: {
            email: ILike(`%${search}%`),
          },
        },
        {
          practiceTeacher: {
            phone: ILike(`%${search}%`),
          },
        },
        {
          category: {
            value: ILike(`%${search}%`),
          },
        },
        {
          id: !isNaN(+search) ? +search : undefined,
        },
      ],
      relations: {
        practiceTeacher: true,
        theoryTeacher: true,
        category: true,
        students: true,
      },
    });
  }

  async getGroupById(groupId: number) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      relations: {
        practiceTeacher: true,
        theoryTeacher: true,
        category: true,
      },
    });

    if (!group) throw new NotFoundException('?????????? ???????????? ???? ????????????????????');

    return group;
  }

  async createGroup(body: CreateGroupDto) {
    const newGroup = await this.groupRepository.create({
      theoryTeacher: await this.getTheoryTeacher(body.theoryTeacherId),
      practiceTeacher: await this.getPracticeTeacher(body.practiceTeacherId),
      category: await this.getCategory(body.categoryId),
    });

    return await this.groupRepository.save(newGroup);
  }

  async updateGroup(groupId: number, body: UpdateGroupDto) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      relations: {
        theoryTeacher: true,
        practiceTeacher: true,
        category: true,
        students: true,
      }
    });

    if (!group) throw new NotFoundException('?????????? ???????????? ???? ????????????????????');

    if (body.theoryTeacherId)
      group.theoryTeacher = await this.getTheoryTeacher(body.theoryTeacherId);
    if (body.practiceTeacherId)
      group.practiceTeacher = await this.getPracticeTeacher(
        body.practiceTeacherId,
      );
    if (body.categoryId)
      group.category = await this.getCategory(body.categoryId);

    return await this.groupRepository.save(group);
  }

  async destroyGroup(groupId: number) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      loadRelationIds: true,
    });

    if (!group) throw new NotFoundException('?????????? ???????????? ???? ????????????????????');

    group.theoryTeacher = null;
    group.practiceTeacher = null;
    group.category = null;
    group.students = null;

    for (const schedule of group.schedules) {
      await this.scheduleRepository.delete(schedule);
    }

    await this.groupRepository.save(group);

    return await this.groupRepository.remove(group);
  }

  async pushStudentToGroup(groupId: number, userId: number) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      relations: {
        students: true,
      },
    });

    if (!group) throw new NotFoundException('?????????? ???????????? ???? ????????????????????');

    const oldStudent = await this.userRepository.findOne({
      where: {
        id: userId,
        role: UserRole.STUDENT,
        group: group,
      },
    });

    if (oldStudent)
      throw new NotFoundException('?????????????? ?????? ???????????????? ?? ???????? ????????????');

    const student = await this.userRepository.findOne({
      where: {
        id: userId,
        role: UserRole.STUDENT,
      },
    });

    if (!student) throw new NotFoundException('???????????? ???????????????? ???? ????????????????????');

    group.students.push(student);

    return await this.groupRepository.save(group);
  }

  async destroyStudentFromGroup(groupId: number, userId: number) {
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
      relations: {
        students: true,
      },
    });

    if (!group) throw new NotFoundException('?????????? ???????????? ???? ????????????????????');

    const student = await this.userRepository.findOne({
      where: {
        id: userId,
        role: UserRole.STUDENT,
        group: group,
      },
      loadRelationIds: true,
    });

    if (!student)
      throw new NotFoundException(
        '???????????? ???????????????? ?? ???????????? ???????????? ???? ????????????????????',
      );

    group.students[group.students.indexOf(student) + 1] = null;

    return await this.groupRepository.save(group);
  }

  async getTheoryTeacher(theoryTeacherId: number) {
    const theoryTeacher = await this.userRepository.findOneBy({
      id: theoryTeacherId,
      role: UserRole.THEORY_TEACHER,
    });

    if (!theoryTeacher)
      throw new NotFoundException('???????????? ?????????????? ???????????? ???? ????????????????????');

    return theoryTeacher;
  }

  async getPracticeTeacher(practiceTeacherId: number) {
    const practiceTeacher = await this.userRepository.findOneBy({
      id: practiceTeacherId,
      role: UserRole.PRACTICE_TEACHER,
    });

    if (!practiceTeacherId)
      throw new NotFoundException('???????????? ?????????????? ???????????????? ???? ????????????????????');

    return practiceTeacher;
  }

  async getCategory(categoryId: number) {
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (!category) throw new NotFoundException('?????????? ?????????????????? ???? ????????????????????');

    return category;
  }
}

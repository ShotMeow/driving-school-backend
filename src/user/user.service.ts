import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { Role } from './enums/userType.enum';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers() {
    return this.userRepository.find();
  }

  async getUsersByRoleAndSearchTerm(query: UserDto) {
    if (query.search) {
      return this.userRepository.find({
        where: [
          { role: query.role, name: ILike(`%${query.search}%`) },
          { role: query.role, surname: ILike(`%${query.search}%`) },
          { role: query.role, patronymic: ILike(`%${query.search}%`) },
        ],
      });
    } else {
      return this.userRepository.find({
        where: {
          role: query.role,
        },
      });
    }
  }

  async getStudentsWithGroup(search: string) {
    console.log(search);
    return this.userRepository.find({
      where: {
        role: Role.STUDENT,
        group: Not(IsNull()),
      },
    });
  }

  async getStudentsWithoutGroup() {
    return this.userRepository.find({
      where: {
        role: Role.STUDENT,
        group: IsNull(),
      },
    });
  }

  async changeUserRole(userId: number, role: Role) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    user.role = role;

    return this.userRepository.save(user);
  }

  async getAuthUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    return user;
  }

  async getGroupByUserId(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        role: Role.STUDENT,
      },
      relations: {
        group: {
          theoryTeacher: true,
          practiceTeacher: true,
          schedules: true,
          category: true,
        },
      },
    });

    if (!user) throw new NotFoundException('Студент не найден');

    return user.group;
  }
}

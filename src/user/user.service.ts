import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRole } from './enums/userType.enum';
import { ChangeRoleDto } from './dto/changeRole.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers(
    search: string = '',
    role: UserRole,
    withGroup: 'true' | 'false',
  ) {
    let withGroupBool;

    if (withGroup === 'true') {
      withGroupBool = true;
    } else if (withGroup === 'false') {
      withGroupBool = false;
    }

    return await this.userRepository.find({
      where: [
        {
          role: role,
          surname: ILike(`%${search}%`),
          group: withGroup && (withGroupBool ? Not(IsNull()) : IsNull()),
        },
        {
          role: role,
          name: ILike(`%${search}%`),
          group: withGroup && (withGroupBool ? Not(IsNull()) : IsNull()),
        },
        {
          role: role,
          patronymic: ILike(`%${search}%`),
          group: withGroup && (withGroupBool ? Not(IsNull()) : IsNull()),
        },
        {
          role: role,
          phone: ILike(`%${search}%`),
          group: withGroup && (withGroupBool ? Not(IsNull()) : IsNull()),
        },
        {
          role: role,
          email: ILike(`%${search}%`),
          group: withGroup && (withGroupBool ? Not(IsNull()) : IsNull()),
        },
      ],
      relations: {
        group: {
          practiceTeacher: true,
          theoryTeacher: true,
          category: true,
        },
      },
    });
  }

  async getUserById(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    return user;
  }

  async changeUserRole(userId: number, body: ChangeRoleDto) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) throw new NotFoundException('Пользователь не найден');
    if (body.role === UserRole.ADMIN)
      throw new BadRequestException('Недостаточно прав для этого действия');

    user.role = body.role;

    return await this.userRepository.save(user);
  }

  async getAuthUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        group: {
          theoryTeacher: true,
          practiceTeacher: true,
          category: true,
          schedules: true
        }
      },
      order: {
        group: {
          schedules: {
            date: "ASC",
            startTime: "ASC"
          }
        }
      }
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    return user;
  }
}

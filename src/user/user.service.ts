import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { Role } from './enums/userType.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers() {
    return this.userRepository.find();
  }

  async getUsersByRole(role: Role) {
    return this.userRepository.find({
      where: {
        role: role,
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

  async getUserProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    return user;
  }
}

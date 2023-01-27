import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserType } from './enums/userType.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers() {
    return this.userRepository.find();
  }

  async GetUsersByType(type: UserType) {
    return this.userRepository.find({
      where: {
        userType: type,
      },
    });
  }
}

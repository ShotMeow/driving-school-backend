import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const oldEmailUser = await this.userRepository.findOneBy({
      email: dto.email,
    });
    if (oldEmailUser)
      throw new BadRequestException({
        field: 'email',
        message: 'Такой E-mail уже используется',
      });

    const oldPhoneUser = await this.userRepository.findOneBy({
      phone: dto.phone,
    });
    if (oldPhoneUser)
      throw new BadRequestException({
        field: 'phone',
        message: 'Номер телефона уже занят',
      });

    const salt = await genSalt(10);

    const newUser = await this.userRepository.create({
      ...dto,
      password: await hash(dto.password, salt),
    });

    const user = await this.userRepository.save(newUser);

    return {
      token: await this.issueAccessToken(user.id),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    return {
      token: await this.issueAccessToken(user.id),
    };
  }

  async validateUser(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user)
      throw new NotFoundException({
        field: 'all',
        message: 'Такого пользователя не существует',
      });

    const isValidPassword = await compare(dto.password, user.password);
    if (!isValidPassword)
      throw new UnauthorizedException({
        field: 'password',
        message: 'Не правильный пароль',
      });

    return user;
  }

  async issueAccessToken(userId: number) {
    const data = {
      id: userId,
    };

    return await this.jwtService.signAsync(data, {
      expiresIn: '31d',
    });
  }
}

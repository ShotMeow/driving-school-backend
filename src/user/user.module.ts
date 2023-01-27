import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Module({
  controllers: [],
  providers: [],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserModule {}

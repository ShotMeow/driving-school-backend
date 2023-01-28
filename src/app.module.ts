import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './group/group.module';
import { CategoryModule } from './category/category.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    GroupModule,
    CategoryModule,
    ScheduleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

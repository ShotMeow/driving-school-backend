import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './group/group.module';
import { CategoryModule } from './category/category.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'driving-school',
      username: 'postgres',
      password: 'admin',
      autoLoadEntities: true,
      synchronize: true,
    }),
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

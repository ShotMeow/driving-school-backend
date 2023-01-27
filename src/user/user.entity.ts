import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../utils/dto.utils';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column()
  surname: string;

  @Column()
  name: string;

  @Column()
  patronymic: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'student' })
  type: 'admin' | 'teacher' | 'student';

  @Column({ default: '' })
  avatar_path: string;
}

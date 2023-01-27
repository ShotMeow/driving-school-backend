import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../utils/dto.utils';

@Entity('category')
export class CategoryEntity extends BaseEntity {
  @Column()
  category: string;
}

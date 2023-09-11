import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsDate } from 'class-validator';
import { ProductsEntity, UsersEntity } from '.';

@Entity({ name: 'likes' })
export class LikeEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  //-- 생성일 --//
  @CreateDateColumn({ type: 'timestamp' })
  @IsDate()
  public created_at: Date;

  @ManyToOne(() => UsersEntity, (user) => user.likes, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  public user: UsersEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public product: ProductsEntity;
}

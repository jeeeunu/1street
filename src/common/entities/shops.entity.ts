import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNumber, IsString, MaxLength } from 'class-validator';
import { ProductsEntity } from './products.entity';
import { UsersEntity } from '.';

@Entity({ name: 'shops' })
export class ShopsEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  //-- 스토어 이름 --//
  @Column({ nullable: false })
  @IsString()
  @MaxLength(30)
  public shop_name: string;

  //-- 스토어 설명 --//
  @Column({ nullable: false })
  @IsString()
  public shop_desc: string;

  //-- 유저 아이디 --//
  @Column({ nullable: false })
  @IsNumber()
  public user_id: number;

  @OneToOne(() => UsersEntity, (user) => user.shop)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: UsersEntity;

  @OneToMany(() => ProductsEntity, (product) => product.shop)
  public products: ProductsEntity[];
}

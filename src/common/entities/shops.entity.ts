import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ProductsEntity } from './products.entity';
import { UsersEntity } from './users.entity';

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

  @ManyToOne(() => UsersEntity, (user) => user.shops)
  public user: UsersEntity;

  @OneToMany(() => ProductsEntity, (product) => product.shop)
  public products: ProductsEntity[];
}

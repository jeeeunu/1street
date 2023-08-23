import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { CategoryEntity } from '../../products/entities/category.entity';
import { ShopsEntity } from './shops.entity';

@Entity({ name: 'products' })
export class ProductsEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  //-- 상품 이름 --//
  @Column({ nullable: false })
  @IsString()
  @MaxLength(30)
  public product_name: string;

  //-- 상품 설명 --//
  @Column({ nullable: false })
  @IsString()
  public product_desc: string;

  //-- 상품 가격 --//
  @Column({ nullable: false })
  @IsNumber()
  public product_price: number;

  //-- 상품 썸네일 --//
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  public product_thumbnail?: string;

  @ManyToOne(() => ShopsEntity, (shop) => shop.products)
  public shop: ShopsEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  public category: CategoryEntity;
}

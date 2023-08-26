import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { CategoryEntity } from '../../products/entities/category.entity';
import { ShopsEntity } from './shops.entity';
import { LikeEntity } from './likes.entity';
import { OrderDetailsEntity } from 'src/orders/entities/order-detail.entity';
import { QnasEntity } from './qnas.entity';
import { ProductImageEntity } from 'src/products/entities/product_image.entity';

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

  //-- 상품 원산지 --//
  @Column({ nullable: false })
  @IsString()
  public product_domestic: string;

  //-- 상품 가격 --//
  @Column({ nullable: false })
  @IsNumber()
  public product_price: number;

  //-- 상품 썸네일 --//
  // @Column({ nullable: true })
  // @IsOptional()
  // @IsString()
  // public product_thumbnail?: string;

  //-- 상품 카테고리 --//
  @Column({ nullable: false })
  @IsNumber()
  public category_number: number;

  @ManyToOne(() => ShopsEntity, (shop) => shop.products)
  public shop: ShopsEntity;

  // @ManyToOne(() => CategoryEntity, (category) => category.products)
  // public category: CategoryEntity;

  @OneToMany(() => LikeEntity, (like) => like.product)
  public likes: LikeEntity[];

  @OneToMany(() => OrderDetailsEntity, (orderDetails) => orderDetails.product)
  public order_detail: OrderDetailsEntity[];

  @OneToMany(() => QnasEntity, (qna) => qna.product)
  public qna: QnasEntity[];

  @OneToMany(() => ProductImageEntity, (product_image) => product_image.product)
  public product_image: ProductImageEntity[];
}

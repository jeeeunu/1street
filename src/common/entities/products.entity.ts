import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { CategoryEntity } from '../../products/entities/category.entity';
import { ShopsEntity } from './shops.entity';
import { LikeEntity } from './likes.entity';
import { OrderDetailsEntity } from 'src/orders/entities/order-detail.entity';
import { QnasEntity } from './qnas.entity';
import { ProductImageEntity } from 'src/products/entities/product-image.entity';

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
  @Column({ nullable: false, length: 4000 })
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

  //-- 카테고리 아이디 --//
  @Column({ nullable: false })
  @IsNumber()
  public category_id: number;

  //-- 스토어 아이디 --//
  @Column({ nullable: false })
  @IsNumber()
  public shop_id: number;

  @ManyToOne(() => ShopsEntity, (shop) => shop.products, {
    onDelete: 'CASCADE',
  })
  // @JoinColumn({ name: 'shop_id', referencedColumnName: 'id' })
  public shop: ShopsEntity;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: string;

  @OneToMany(() => LikeEntity, (like) => like.product)
  public likes: LikeEntity[];

  @OneToMany(() => OrderDetailsEntity, (orderDetails) => orderDetails.product)
  public order_detail: OrderDetailsEntity[];

  @OneToMany(() => QnasEntity, (qna) => qna.product)
  public qna: QnasEntity[];

  @OneToMany(() => ProductImageEntity, (product_image) => product_image.product)
  public product_image: ProductImageEntity[];

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  // @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  public category: CategoryEntity;
}

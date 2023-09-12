import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNumber, IsString, MaxLength } from 'class-validator';
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

  @Column({ nullable: false })
  @IsString()
  @MaxLength(30)
  public product_name: string;

  @Column({ nullable: false, type: 'text' })
  @IsString()
  public product_desc: string;

  @Column({ nullable: false })
  @IsString()
  public product_domestic: string;

  @Column({ nullable: false })
  @IsNumber()
  public product_price: number;

  @Column({ nullable: false })
  @IsNumber()
  public shop_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: string;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: string;

  @ManyToOne(() => ShopsEntity, (shop) => shop.products, {
    onDelete: 'CASCADE',
  })
  public shop: ShopsEntity;

  @OneToMany(() => LikeEntity, (like) => like.product)
  public likes: LikeEntity[];

  @OneToMany(() => OrderDetailsEntity, (orderDetails) => orderDetails.product, {
    onDelete: 'CASCADE',
  })
  public order_detail: OrderDetailsEntity[];

  @OneToMany(() => QnasEntity, (qna) => qna.product, {
    onDelete: 'CASCADE',
  })
  public qna: QnasEntity[];

  @OneToMany(() => ProductImageEntity, (product_image) => product_image.product)
  public product_image: ProductImageEntity[];

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  public category: CategoryEntity;
}

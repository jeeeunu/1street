import {
  OrdersEntity,
  ProductsEntity,
  ReviewsEntity,
} from 'src/common/entities';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

export enum OrderReviewStatus {
  notWritten = '0',
  written = '1',
}

@Entity({ name: 'order_details' })
export class OrderDetailsEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public order_quantity: number;

  @ManyToOne(() => OrdersEntity, (order) => order.order_details, {
    onDelete: 'CASCADE',
  })
  public order: OrdersEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.order_detail)
  public product: ProductsEntity;

  @OneToOne(() => ReviewsEntity, (review) => review.order_detail)
  public review: ReviewsEntity;
}

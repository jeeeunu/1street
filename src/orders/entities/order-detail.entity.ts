import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrdersEntity } from '../../common/entities/orders.entity';

export enum OrderReviewStatus {
  notWritten = '0',
  written = '1',
}

@Entity({ name: 'orderDetails' })
export class OrderDetailsEntity {
  @PrimaryGeneratedColumn()
  public order_detail_id: number;

  @Column()
  public product_id: number;

  @Column()
  public order_quantity: number;

  @OneToMany(() => OrdersEntity, (order) => order.order)
  @JoinColumn({ name: 'order' })
  public order: OrdersEntity;
}

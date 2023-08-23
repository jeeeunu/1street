import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrdersEntity } from '../../common/entities/orders.entity';
export enum OrderReviewStatus {
  notWritten = '0',
  written = '1',
}
@Entity({ name: 'order_details' })
export class OrderDetailsEntity {
  @PrimaryGeneratedColumn()
  public order_detail_id: number;
  @Column()
  public product_id: number;
  @Column()
  public order_quantity: number;
  // @ManyToOne(() => OrdersEntity, (order) => order.order_id)
  // @JoinColumn({ name: 'order_id' })
  // public order_id: OrdersEntity;
  @Column()
  public order_id: number;
}

// import { IsOptional } from 'class-validator';
import { UsersEntity } from 'src/common/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { OrderDetailsEntity } from '../../orders/entities/order-detail.entity';
import { IsOptional, Min } from 'class-validator';
export enum OrderStatus {
  OrderCancel = '0',
  OrderPending = '1',
  OrderConfirm = '2',
  OrderShipping = '3',
  orderDelivering = '4',
  DeliveryComplete = '5',
}
@Entity({ name: 'orders' })
export class OrdersEntity {
  @PrimaryGeneratedColumn()
  public order_id: number;
  @OneToMany(() => OrderDetailsEntity, (orderDetail) => orderDetail.order_id)
  public order_details: OrderDetailsEntity[];
  @ManyToOne(() => UsersEntity, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  public user: UsersEntity;
  @Column()
  // @IsOptional()
  public order_receiver: string;
  @Column()
  // @IsOptional()
  public order_phone: string;
  @Column()
  // @IsOptional()
  public order_email: string;
  @Column()
  // @IsOptional()
  public order_address: string;
  @Column()
  public order_payment_amount: number;
  @Column({ default: '1' })
  public order_status: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public created_at: Timestamp;
}

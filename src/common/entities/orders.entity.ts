import { UsersEntity } from 'src/common/entities/users.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { OrderDetailsEntity } from '../../orders/entities/order-detail.entity';

export enum OrderStatus {
  OrderCancel = 'OrderCancel',
  OrderPending = 'OrderPending',
  OrderConfirm = 'OrderConfirm',
  OrderShipping = 'OrderShipping',
  orderDelivering = 'orderDelivering',
  DeliveryComplete = 'DeliveryComplete',
}

@Entity({ name: 'orders' })
export class OrdersEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToMany(() => OrderDetailsEntity, (orderDetail) => orderDetail.order)
  public order_details: OrderDetailsEntity[];

  @ManyToOne(() => UsersEntity, (user) => user.orders)
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
  @Column({
    default: OrderStatus.OrderPending,
    type: 'enum',
    enum: OrderStatus,
  })
  public order_status: OrderStatus;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public created_at: Timestamp;
}

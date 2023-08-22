// import { IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

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

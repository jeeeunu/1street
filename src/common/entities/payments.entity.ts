import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrdersEntity, UsersEntity } from '.';

export enum PAYMENTSTATUS {
  PAYMENT = 'PAYMENT',
  CANCEL = 'CANCEL',
}

@Entity({ name: 'payments' })
export class PaymentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  imp_uid: string;

  @Column()
  merchant_uid: string;

  @Column({ default: PAYMENTSTATUS.PAYMENT, type: 'enum', enum: PAYMENTSTATUS })
  status: PAYMENTSTATUS;

  @ManyToOne(() => UsersEntity, (user) => user.payment)
  user: UsersEntity;

  @ManyToOne(() => OrdersEntity, (order) => order.payment)
  order: OrdersEntity;
}

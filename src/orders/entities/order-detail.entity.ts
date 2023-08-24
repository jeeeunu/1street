import { OrdersEntity, ProductsEntity } from 'src/common/entities';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

export enum OrderReviewStatus {
  notWritten = '0',
  written = '1',
}

@Entity({ name: 'order_details' })
export class OrderDetailsEntity {
  @PrimaryGeneratedColumn()
  public order_detail_id: number;

  @Column()
  public order_quantity: number;

  @ManyToOne(() => OrdersEntity, (order) => order.order_details)
  public order: OrdersEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.order_detail)
  public product: ProductsEntity;
}

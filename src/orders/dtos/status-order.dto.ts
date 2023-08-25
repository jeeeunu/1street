import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../../common/entities/orders.entity';

export class OrderStatusDto {
  @IsString()
  @IsOptional()
  @IsEnum(OrderStatus)
  readonly order_status: string;
}

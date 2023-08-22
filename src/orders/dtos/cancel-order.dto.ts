import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../../common/entities/orders.entity';

export class OrderCancelDto {
  @IsString()
  @IsOptional()
  @IsEnum(OrderStatus)
  readonly order_status: string;
}

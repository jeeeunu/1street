import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../entities/_orders.entity';

export class OrderCancelDto {
  @IsString()
  @IsOptional()
  @IsEnum(OrderStatus)
  readonly order_status: string;
}

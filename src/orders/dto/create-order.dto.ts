import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderStatus } from '../entities/orders.entity';

export class OrderCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly order_receiver: string;

  @IsNotEmpty()
  @IsString()
  readonly order_phone: string;

  @IsNotEmpty()
  @IsEmail()
  readonly order_email: string;

  @IsNotEmpty()
  @IsString()
  readonly order_address: string;

  @IsNotEmpty()
  @IsNumber()
  readonly order_payment_amount: number;

  @IsString()
  @IsOptional()
  @IsEnum(OrderStatus)
  readonly order_status: string;

  @IsOptional()
  @IsDate()
  readonly created_at: Date;
}

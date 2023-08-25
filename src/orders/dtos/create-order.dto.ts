import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ArrayNotEmpty,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../common/entities/orders.entity';

class OrderDetails {
  @IsNumber()
  readonly product_id: number;

  @IsNumber()
  readonly order_quantity: number;

  @IsNumber()
  readonly review_flag: number;
}

export class OrderCreateDto {
  @IsNumber()
  @IsOptional()
  readonly user_id: number;

  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderDetails)
  readonly order_details: OrderDetails[];

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

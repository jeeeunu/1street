import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderUpdateDto {
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
}

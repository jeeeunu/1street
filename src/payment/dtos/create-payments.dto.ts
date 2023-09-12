import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  imp_uid: string;

  @IsNotEmpty()
  @IsString()
  merchant_uid: string;

  @IsNotEmpty()
  @IsNumber()
  order_id: number;
}

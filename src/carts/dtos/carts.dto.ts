import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  product_id: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQnasDto {
  // @IsNotEmpty()
  // @IsNumber()
  // readonly id: number;

  @IsNotEmpty()
  @IsNumber()
  readonly product_id: number;

  @IsNotEmpty()
  @IsNumber()
  readonly shop_id: number;

  @IsNotEmpty()
  @IsString()
  readonly qna_name: string;

  @IsNotEmpty()
  @IsString()
  readonly qna_content: string;
}

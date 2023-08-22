import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class ShopUpdateDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  //-- 스토어 설명 --//
  @IsOptional()
  @IsString()
  @MaxLength(30)
  readonly shop_name: string;

  //-- 스토어 설명 --//
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly shop_desc: string;

  //-- 스토어 썸네일 --//
  @IsOptional()
  @IsString()
  readonly shop_image?: string;
}

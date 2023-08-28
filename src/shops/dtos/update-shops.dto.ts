import { IsOptional, IsString } from 'class-validator';
export class ShopUpdateDto {
  //-- 스토어 설명 --//
  @IsOptional()
  @IsString()
  readonly shop_name: string;

  //-- 스토어 설명 --//
  @IsOptional()
  @IsString()
  readonly shop_desc: string;
}

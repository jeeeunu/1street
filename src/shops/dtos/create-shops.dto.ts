import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
export class ShopCreateDto {
  //-- 스토어 이름--//
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  readonly shop_name: string;

  //-- 스토어 설명 --//
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  readonly shop_desc: string;

  //-- 스토어 썸네일 --//
  @IsOptional()
  @IsString()
  readonly shop_image?: string;
}

import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class ProductUpdateDto {
  //-- 상품 이름 --//
  @IsOptional()
  @IsString()
  @MaxLength(30)
  public product_name: string;

  //-- 상품 설명 --//
  @IsOptional()
  @IsString()
  public product_desc: string;

  //-- 상품 가격 --//
  @IsOptional()
  @IsNumber()
  public product_price: number;

  //-- 상품 썸네일 --//
  @IsOptional()
  @IsString()
  public product_thumbnail: string;

  //-- 카테고리 번호 --//
  @IsOptional()
  @IsNumber()
  public category: number;
}

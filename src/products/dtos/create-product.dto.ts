import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
export class ProductCreateDto {
  //-- 스토어 아이디 --//
  @IsNotEmpty()
  @IsNumber()
  public shop_id: number;

  //-- 상품 이름 --//
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  public product_name: string;

  //-- 상품 설명 --//
  @IsNotEmpty()
  @IsString()
  public product_desc: string;

  //-- 상품 가격 --//
  @IsNotEmpty()
  @IsNumber()
  public product_price: number;

  //-- 상품 썸네일 --//
  @IsNotEmpty()
  @IsString()
  public product_thumbnail: string;

  //-- 카테고리 번호 --//
  @IsNotEmpty()
  @IsNumber()
  public category: number;
}

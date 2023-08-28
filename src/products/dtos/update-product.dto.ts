import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
export class ProductUpdateDto {
  //-- 상품 이름 --//
  @IsOptional()
  @IsString()
  public product_name: string;

  //-- 상품 설명 --//
  @IsOptional()
  @IsString()
  public product_desc: string;

  //-- 상품 가격 --//
  @IsOptional()
  @IsNumber()
  public product_price: number;

  //-- 카테고리 번호 --//
  @IsOptional()
  @IsNumber()
  public category_id: number;

  //-- 상품 원산지 --//
  @IsOptional()
  @IsString()
  public product_domestic: string;

  //-- 삭제할 이미지 --//
  @IsOptional()
  public delete_imgs: number[];
}

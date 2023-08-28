import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class ProductCreateDto {
  //-- 스토어 아이디 --//
  // @IsNotEmpty()
  // @IsNumber()
  // public shop_id: number;

  //-- 상품 이름 --//
  @IsNotEmpty({ message: '상품 이름을 입력해주세요.' })
  @IsString({ message: '상품 이름을 입력해주세요.' })
  @MaxLength(30)
  public product_name: string;

  //-- 상품 설명 --//
  @IsNotEmpty({ message: '상품 설명을 입력해주세요.' })
  @IsString({ message: '상품 설명을 입력해주세요.' })
  public product_desc: string;

  //-- 상품 가격 --//
  @IsNotEmpty({ message: '상품 가격을 입력해주세요.' })
  @IsNumber()
  public product_price: number;

  //-- 상품 썸네일 --//
  @IsOptional({ message: '한개 이상의 이미지를 첨부해주세요.' })
  public files: Express.Multer.File[];

  //-- 상품 원산지 --//
  @IsNotEmpty({ message: '상품 원산지를 입력해주세요.' })
  @IsString({ message: '상품 원산지를 입력해주세요.' })
  public product_domestic: string;

  //-- 카테고리 번호 --//
  @IsNotEmpty({ message: '카테고리를 선택해주세요.' })
  @IsNumber()
  public category_id: number;
}

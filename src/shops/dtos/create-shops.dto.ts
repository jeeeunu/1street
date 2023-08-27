import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class ShopCreateDto {
  //-- 스토어 이름--//
  @IsNotEmpty({ message: '스토어 이름을 입력해주세요.' })
  @IsString()
  // @MaxLength(30)
  readonly shop_name: string;

  //-- 스토어 설명 --//
  @IsNotEmpty({ message: '스토어 설명을 입력해주세요.' })
  @IsString()
  // @MaxLength(100)
  readonly shop_desc: string;
}

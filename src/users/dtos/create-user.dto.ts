import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  Length,
  Matches,
} from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[0-9])[a-z0-9]+$/i, {
    message: '비밀번호는 최소 하나의 소문자와 하나의 숫자를 포함해야 합니다.',
  })
  @Length(8, 20, {
    message: '비밀번호 길이는 8자 이상 20자 이하여야 합니다.',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsString()
  readonly phone_number: string;

  @IsString()
  readonly address: string;

  @IsOptional()
  @IsString()
  readonly point: number;

  @IsOptional()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsBoolean()
  readonly seller_flag: boolean;

  @IsOptional()
  @IsString()
  readonly provider: string;

  @IsOptional()
  readonly files: Express.Multer.File[];
}

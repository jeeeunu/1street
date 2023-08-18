import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  Length,
  Matches,
} from 'class-validator';
export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly login_id: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[0-9])[a-z0-9]+$/, {
    message: '비밀번호는 최소 하나의 소문자와 하나의 숫자를 포함해야 합니다.',
  })
  @Length(8, 20, {
    message: '비밀번호 길이는 8자 이상 20자 이하여야 합니다.',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly phone_number: string;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsOptional()
  @IsString()
  readonly point: number;

  @IsOptional()
  @IsBoolean()
  readonly seller_flag: boolean;
}

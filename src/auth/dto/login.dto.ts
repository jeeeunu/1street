import { IsString, Length, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  readonly email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[0-9])[a-z0-9]+$/, {
    message: '비밀번호는 최소 하나의 소문자와 하나의 숫자를 포함해야 합니다.',
  })
  @Length(8, 20, {
    message: '비밀번호 길이는 8자 이상 20자 이하여야 합니다.',
  })
  readonly password: string;
}

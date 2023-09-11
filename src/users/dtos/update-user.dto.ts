import { IsString, IsOptional, Matches, Length } from 'class-validator';
export class UpdateUserDto {
  @IsString({ message: '올바른 비밀번호를 입력해주세요.' })
  @Matches(/^(?=.*[a-z])(?=.*[0-9])[a-z0-9!@#$%^&*()_+{}:;<>,.?~=-]+$/i, {
    message: '비밀번호는 최소 하나의 소문자와 하나의 숫자를 포함해야 합니다.',
  })
  @Length(8, 20, {
    message: '비밀번호 길이는 8자 이상 20자 이하여야 합니다.',
  })
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly profile_image: string;

  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly phone_number: string;

  @IsString()
  @IsOptional()
  readonly address: string;
}

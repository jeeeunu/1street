import { IsString, IsOptional } from 'class-validator';
export class UpdateUserDto {
  @IsString({ message: '올바른 비밀번호를 입력해주세요.' })
  @IsOptional()
  readonly password: string;

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

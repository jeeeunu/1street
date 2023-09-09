import { IsOptional, IsString } from 'class-validator';

export class GoogleLoginAuthOutputDto {
  @IsOptional()
  @IsString()
  accessToken?: string;
}

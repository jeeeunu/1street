import { IsOptional, IsString, isBoolean } from 'class-validator';

export class GoogleLoginAuthOutputDto {
  @IsOptional()
  @IsString()
  accessToken?: string;
}

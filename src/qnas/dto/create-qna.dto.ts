import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class QnaCreateDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;
}

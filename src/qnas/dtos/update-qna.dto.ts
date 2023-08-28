import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UpdateQnasDto {
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

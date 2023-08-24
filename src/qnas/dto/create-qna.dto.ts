import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQnasDto {
  // @IsNotEmpty()
  // @IsNumber()
  // readonly id: number;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;
}

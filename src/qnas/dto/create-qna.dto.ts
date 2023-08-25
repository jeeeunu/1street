import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQnasDto {
  // @IsNotEmpty()
  // @IsNumber()
  // readonly id: number;

  @IsNotEmpty()
  @IsString()
  readonly qna_name: string;

  @IsNotEmpty()
  @IsString()
  readonly qna_content: string;
}

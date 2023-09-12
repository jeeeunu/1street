import { IsNumber, IsString, Length } from 'class-validator';

export class CreateQnaAnswerDto {
  @IsNumber()
  qnaId: number;

  @IsNumber()
  shop_id: number;

  @IsString()
  @Length(1, 1000)
  answerContent: string;
}

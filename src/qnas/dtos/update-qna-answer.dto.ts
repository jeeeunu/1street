import { IsString, Length } from 'class-validator';

export class UpdateQnaAnswerDto {
  @IsString()
  @Length(1, 1000)
  readonly answerContent: string;
}

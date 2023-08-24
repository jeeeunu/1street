import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
export class CreateReviewsDto {
  @IsNotEmpty()
  @IsNumber()
  readonly review_rating: number;

  @IsOptional()
  @IsString()
  readonly review_content: string;
}

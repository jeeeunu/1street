import { IsString, IsOptional, IsNumber } from 'class-validator';
export class UpdateReviewsDto {
  @IsOptional()
  @IsNumber()
  readonly review_rating: number;

  @IsOptional()
  @IsString()
  readonly review_content: string;
}

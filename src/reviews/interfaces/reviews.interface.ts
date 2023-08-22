export interface ReviewInterface {
  status: boolean;
  results: ReviewResult[];
}

export interface ReviewResult {
  id: number;
  user_id: number;
  order_detail_id: number;
  review_rating: number;
  review_content?: string;
  created_at: string;
  updated_at: string;
}

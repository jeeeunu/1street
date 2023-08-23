export interface QnaInterface {
  // QnaInterface의 상태. 이 값이 참(true)인지 거짓(false)인지에 따라
  // Q&A 데이터의 유효성 또는 사용 가능한 상태를 나타낼 수 있다.
  id: number;
  product_id: number;
  status: boolean;
  results: QnaResult[];
}

export interface QnaResult {
  // 리뷰의 경우 유저, 오더 디테일, 프라이머리키인 id, 별점, 리뷰내용, 생성일자, 수정일자로 구성
  // qna의 경우 유저, product, id, 제목, 내용, 생성일자, 수정일자로 구성
  id: number;
  user_id: number;
  product_id: number;
  qna_name: string;
  qna_content: string;
  created_at: string;
  updated_at: string;
}

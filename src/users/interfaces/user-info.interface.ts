export interface userInfo {
  status: boolean;
  results: {
    email: string;
    name: string;
    phone_number: string;
    address: string;
    point: number;
    seller_flag: boolean;
    // TODO :: 유저와 연결된 테이블 설정
    // like: [];
  };
}

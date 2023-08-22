export interface userInfo {
  status: boolean;
  results: {
    email: string;
    name: string;
    phone_number: string;
    address: string;
    point: number;
    seller_flag: boolean;
  };
}

export interface orderInterface {
  order_id: number;
  user_id: number;
  order_receiver: string;
  order_phone: string;
  order_email: string;
  order_address: string;
  order_payment_amount: number;
  order_status: string;
  created_at: Date;
}

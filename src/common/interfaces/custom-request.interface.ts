import { Request } from 'express';

export interface CustomRequest extends Request {
  user: {
    user_id: number;
    email: string;
    isAdmin: boolean;
    user_name: string;
  };
}

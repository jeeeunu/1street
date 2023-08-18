import { Request } from 'express';

export interface CustomRequest extends Request {
  user: {
    login_id: string;
    isAdmin: boolean;
    user_id: number;
  };
}

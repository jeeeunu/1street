import { Request } from 'express';

export interface CustomRequest extends Request {
  user: {
    email: string;
    isAdmin: boolean;
    user_name: string;
  };
}

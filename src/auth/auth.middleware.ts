import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authenticationCookie = req.headers.cookie?.includes('Authentication');
    res.locals.authenticationCookie = authenticationCookie || false;
    next();
  }
}

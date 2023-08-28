import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopsEntity } from 'src/common/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(ShopsEntity)
    private shopsEntity: Repository<ShopsEntity>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authenticationCookie = req.headers.cookie?.includes('Authentication');
    res.locals.authenticationCookie = authenticationCookie || false;

    const authToken = req.headers.cookie
      ?.split('; ')
      .find((cookie) => cookie.startsWith('Authentication='))
      ?.split('=')[1];

    if (authToken) {
      try {
        const payload = this.jwtService.verify(authToken);
        const shop = await this.shopsEntity.findOne({
          where: { user_id: payload.user_id },
        });
        const user = {
          user_id: payload.user_id,
          email: payload.email,
          user_name: payload.user_name,
          profile_image: payload.profile_image,
          isAdmin: payload.isAdmin || false,
          shop_id: shop ? shop.id : undefined,
        };

        req.user = user;
      } catch (err) {
        console.error(err, err.stack);
        if (err instanceof TokenExpiredError) {
          res.clearCookie('Authentication');
        }
      }
    }

    next();
  }
}

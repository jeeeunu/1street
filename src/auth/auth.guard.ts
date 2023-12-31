import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { UsersEntity } from '../common/entities/users.entity';
import { ShopsEntity } from 'src/common/entities';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    @InjectRepository(ShopsEntity)
    private shopsEntity: Repository<ShopsEntity>,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('authGuard 실행');
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.cookie
      ?.split('; ')
      .find((cookie) => cookie.startsWith('Authentication='))
      .split('=')[1];

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

        request.user = user;
        return true;
      } catch (err) {
        console.error(err, err.stack);
        if (err instanceof TokenExpiredError) {
          throw new UnauthorizedException(
            '토큰이 만료되었습니다. 다시 로그인해주세요.',
          );
        }
        throw new UnauthorizedException('로그인 인증이 필요합니다.');
      }
    } else {
      throw new UnauthorizedException('로그인 후 진행해주세요');
    }
  }
}

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
import { UsersEntity } from '../users/entities/users.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.cookie
      ?.split('; ')
      .find((cookie) => cookie.startsWith('Authentication='))
      .split('=')[1];

    if (authToken) {
      try {
        const payload = this.jwtService.verify(authToken);
        const user = {
          email: payload.email,
          isAdmin: payload.isAdmin || false,
          user_name: payload.user_name,
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
        throw new UnauthorizedException('로그인 후 진행해주세요.');
      }
    }
    return false;
  }
}

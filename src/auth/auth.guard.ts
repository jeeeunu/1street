import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.cookie
      ?.split('; ')
      .find((cookie) => cookie.startsWith('Authentication='))
      .split('=')[1];

    if (authToken) {
      try {
        const payload = this.jwtService.verify(authToken);
        request.user = {
          email: payload.email,
          isAdmin: payload.isAdmin,
          user_name: payload.user_name,
        };
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

// auth.service.ts
import { Injectable, Res } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SignInDto, GoogleLoginAuthOutputDto } from './dto';
import { UserEntity, Provider } from '../users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>, // private userService: UserService,
    private jwtService: JwtService,
  ) {}

  //-- 로그인 --//
  async signIn(signInDto: SignInDto): Promise<string> {
    try {
      const userFind = await this.userRepository.findOne({
        where: { email: signInDto.email },
      });

      // 암호화된 비밀번호와 비교
      const isPasswordMatching: boolean = await bcrypt.compare(
        signInDto.password,
        userFind.password,
      );

      if (!isPasswordMatching) {
        throw new HttpException(
          '비밀번호가 일치하지 않습니다.',
          HttpStatus.FORBIDDEN,
        );
      }

      // JWT 토큰에 포함될 payload
      const payload = {
        email: signInDto.email,
        isAdmin: userFind.seller_flag,
        user_name: userFind.name,
      };

      const access_token = await this.jwtService.signAsync(payload);
      return access_token;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //-- 구글 로그인 --//
  async googleLogin(req): Promise<string> {
    try {
      if (!req.user) {
        throw new HttpException(
          { status: false, message: '구글 아이디 정보가 없습니다.' },
          HttpStatus.NOT_FOUND,
        );
      }
      const access_token = req.user.accessToken;
      return access_token;
    } catch (error) {
      console.error(error, error.stack);
      throw new HttpException(
        {
          status: false,
          message:
            '서버 내부 오류로 처리할 수 없습니다. 나중에 다시 시도해주세요.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

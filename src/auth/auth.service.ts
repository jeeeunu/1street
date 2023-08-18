// auth.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { UserEntity } from '../users/entities/user.entity';

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
        where: { login_id: signInDto.login_id },
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
        login_id: signInDto.login_id,
        isAdmin: userFind.seller_flag,
        user_id: userFind.name,
      };

      const access_token = await this.jwtService.signAsync(payload); // expiresIn은 auth.modules 설정에 따라 자동으로 적용됨
      return access_token;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

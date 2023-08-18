import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LoginDto } from './dto';
import { UsersEntity } from '../users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
  ) {}

  //-- 로그인 --//
  async signIn(loginDto: LoginDto): Promise<string> {
    const userFind = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    // 암호화된 비밀번호와 비교
    const isPasswordMatching: boolean = await bcrypt.compare(
      loginDto.password,
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
      email: loginDto.email,
      isAdmin: userFind.seller_flag,
      user_name: userFind.name,
    };

    const access_token = await this.jwtService.signAsync(payload);
    return access_token;
  }

  //-- google --//
  async googleLogin(req): Promise<string> {
    console.log(req.user); // google에서 제공하는 userinfo 값
    if (!req.user) {
      throw new HttpException(
        { status: false, message: '구글 아이디 정보가 없습니다.' },
        HttpStatus.NOT_FOUND,
      );
    }

    // 유저 없으면 회원가입 처리
    const findUser = await this.userRepository.findOne({
      where: { email: req.user.email },
    });

    const fullName = `${req.user.firstName || ''} ${req.user.lastName || ''}`;

    if (!findUser) {
      const newUser = new UsersEntity();
      newUser.email = req.user.email;
      newUser.name = fullName;
      newUser.profile_image = req.user.picture;
      newUser.provider = 'google';
      await this.userRepository.save(newUser);
      return;
    }

    // JWT 토큰에 포함될 payload
    const payload = {
      email: req.user.email,
      user_name: req.user.lastName,
    };

    const access_token = await this.jwtService.signAsync(payload);

    // const access_token = req.user.accessToken;
    return access_token;
  }
}

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos';
import { UsersEntity } from '../common/entities/users.entity';
import { ShopsEntity } from 'src/common/entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(ShopsEntity)
    private shopsEntity: Repository<ShopsEntity>,
    private jwtService: JwtService,
  ) {}

  //-- 로그인 --//
  async signIn(loginDto: LoginDto): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user)
      throw new NotFoundException(
        '일치하는 유저가 없습니다. 입력하신 내용을 다시 확인해주세요',
      );

    // 암호화된 비밀번호와 비교
    const isPasswordMatching: boolean = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatching)
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');

    // JWT 토큰에 포함될 payload
    const payload = {
      user_id: user.id,
      email: loginDto.email,
      profile_image: user.profile_image,
      user_name: user.name,
      isAdmin: user.seller_flag,
    };

    const access_token = await this.jwtService.signAsync(payload);
    return access_token;
  }

  //-- google --//
  async googleLogin(req): Promise<string> {
    // console.log(req.user); // google에서 제공하는 userinfo 값

    if (!req.user) throw new NotFoundException('구글 아이디 정보가 없습니다.');

    // 유저 없으면 회원가입 처리
    const user = await this.usersRepository.findOne({
      where: { email: req.user.email },
    });

    const fullName = `${req.user.firstName || ''} ${req.user.lastName || ''}`;

    if (!user) {
      const newUser = new UsersEntity();
      newUser.email = req.user.email;
      newUser.name = fullName;
      newUser.profile_image = req.user.picture;
      newUser.provider = 'google';
      await this.usersRepository.save(newUser);
      return;
    }

    // JWT 토큰에 포함될 payload
    const payload = {
      user_id: user.id,
      user_name: req.user.lastName,
      email: req.user.email,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return access_token;
  }
}

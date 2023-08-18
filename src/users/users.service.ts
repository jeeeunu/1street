import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  //-- 회원가입 --//
  async signUp(
    userDto: UserCreateDto,
  ): Promise<{ status: boolean; message: string }> {
    try {
      userDto.password = await bcrypt.hash(userDto.password, 10);
      await this.userRepository.save(userDto);
      return { status: true, message: '회원가입이 완료되었습니다' };
    } catch (error) {
      console.error(error, error.stack);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          { status: false, message: '이미 사용 중인 아이디입니다' },
          HttpStatus.BAD_REQUEST,
        );
      }
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

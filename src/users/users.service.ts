import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './dto/create-user.dto';
import { UsersEntity } from './entities/users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
  ) {}

  //-- 일반 회원가입 --//
  async signUp(
    userDto: UserCreateDto,
  ): Promise<{ status: boolean; message: string }> {
    userDto.password = await bcrypt.hash(userDto.password, 10);
    await this.userRepository.save(userDto);
    return { status: true, message: '회원가입이 완료되었습니다' };
  }
}

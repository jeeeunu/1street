import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserCreateDto, EditUserDto } from './dto';
import { UsersEntity } from './entities/users.entity';
import { userInfo } from './interfaces';
import { ResultableInterface } from 'src/common/interfaces';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('사용자를 찾을 수 없습니다.');
  }
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  //-- 일반 회원가입 --//
  async signUp(userDto: UserCreateDto): Promise<ResultableInterface> {
    userDto.password = await bcrypt.hash(userDto.password, 10);
    await this.usersRepository.save(userDto);
    return { status: true, message: '회원가입이 완료되었습니다.' };
  }

  //-- 유저 조회 --//
  async find(user_id: number): Promise<userInfo> {
    const userFind = await this.usersRepository.findOne({
      where: { id: user_id },
      // relations: ['like', 'cart', 'qna'],
    });

    if (!userFind) {
      throw new UserNotFoundException();
    }

    const data = {
      email: userFind.email,
      name: userFind.name,
      phone_number: userFind.phone_number,
      address: userFind.address,
      point: userFind.point,
      seller_flag: userFind.seller_flag,
    };

    return { status: true, results: data };
  }

  //-- 유저 수정 --//
  async edit(
    user_id: number,
    editUserDto: EditUserDto,
  ): Promise<ResultableInterface> {
    const userFind = await this.usersRepository.findOne({
      where: { id: user_id },
    });

    if (!userFind) {
      throw new UserNotFoundException();
    }

    Object.assign(userFind, editUserDto);
    await this.usersRepository.save(userFind);

    return { status: true, message: '회원 정보가 수정되었습니다.' };
  }

  //-- 유저 탈퇴 --//
  async delete(userId: number): Promise<ResultableInterface> {
    const deletedUser = await this.usersRepository.delete(userId);

    if (deletedUser.affected === 0)
      throw new NotFoundException('사용자를 찾지 못했습니다.');

    return { status: true, message: '회원탈퇴가 완료되었습니다.' };
  }
  
  async findOne(userId: number): Promise<UsersEntity> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }
}

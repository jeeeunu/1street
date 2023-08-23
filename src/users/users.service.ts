import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';

import { UploadsService } from 'src/uploads/uploads.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, EditUserDto } from './dtos';
import { UsersEntity } from '../common/entities/users.entity';
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
    private uploadsService: UploadsService,
  ) {}

  //-- 일반 회원가입 --//
  async signUp(
    userDto: CreateUserDto,
    files: Express.Multer.File[],
  ): Promise<ResultableInterface> {
    userDto.password = await bcrypt.hash(userDto.password, 10);
    const createUser = await this.usersRepository.save(userDto);
    const imageUrl = await this.uploadsService.createS3Images(files);
    return { status: true, message: '회원가입이 완료되었습니다.' };
  }

  //-- 유저 조회 --//
  async find(user_id: number): Promise<userInfo> {
    const user = await this.usersRepository.findOne({
      where: { id: user_id },
      // TODO :: 유저와 연결된 테이블 설정
      relations: ['likes', 'likes.product'],
      select: {
        likes: {
          product: {
            product_thumbnail: true,
            product_name: true,
          },
        },
      },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return { status: true, results: user };
  }

  //-- 유저 수정 --//
  async edit(
    user_id: number,
    editUserDto: EditUserDto,
  ): Promise<ResultableInterface> {
    const existingUser = await this.usersRepository.findOne({
      where: { id: user_id },
    });

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    Object.assign(existingUser, editUserDto);
    await this.usersRepository.save(existingUser);

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
    return await this.usersRepository.findOne({ where: { id: userId } });
  }
}

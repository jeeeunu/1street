import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
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
    private usersEntity: Repository<UsersEntity>,
    private uploadsService: UploadsService,
  ) {}

  //-- 일반 회원가입 --//
  async signUp(
    userDto: CreateUserDto,
    files: Express.Multer.File[],
  ): Promise<ResultableInterface> {
    userDto.password = await bcrypt.hash(userDto.password, 10);
    const existingUser = await this.usersEntity.findOne({
      where: [{ email: userDto.email }, { phone_number: userDto.phone_number }],
    });

    if (existingUser) {
      throw new ConflictException('이미 존재하는 아이디나 핸드폰 번호입니다.');
    }

    const createUser = await this.usersEntity.save(userDto);

    if (files.length > 0) {
      const imageUrl = await this.uploadsService.createProfileImage(files);
      createUser.profile_image = imageUrl;
      if (!imageUrl) throw new BadRequestException();
    } else {
      createUser.profile_image = null;
    }

    await this.usersEntity.save(createUser);
    return { status: true, message: '회원가입이 완료되었습니다.' };
  }

  //-- 유저 조회 --//
  async find(userId: number): Promise<userInfo> {
    // TODO :: 장바구니 개수, orders_details 불러오기
    const user = await this.usersEntity
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.orders', 'orders')
      .leftJoinAndSelect('user.qna', 'qna')
      .leftJoinAndSelect('orders.order_details', 'order_details')
      .leftJoinAndSelect('order_details.product', 'product')
      .where('user.id = :id', { id: userId })
      .loadRelationCountAndMap('user.like_count', 'user.likes')
      .loadRelationCountAndMap('orders.orders_count', 'user.orders')
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.profile_image',
        'user.address',
        'user.phone_number',
        'user.provider',
        'user.point',
        'orders.id',
        'orders.order_payment_amount',
        'orders.created_at',
        'order_details.id',
        'order_details.order_quantity',
        'product.id',
        'product.product_name',
        'qna.id',
      ])
      .getOne();

    if (!user) {
      throw new UserNotFoundException();
    }

    return { status: true, results: user };
  }

  //-- 유저 수정 --//
  async edit(
    userId: number,
    editUserDto: EditUserDto,
    files: Express.Multer.File[],
  ): Promise<ResultableInterface> {
    const existingUser = await this.usersEntity.findOne({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    if (files.length !== 0) {
      const imageUrl = await this.uploadsService.editProfileImage(
        existingUser.profile_image,
        files,
      );
      existingUser.profile_image = imageUrl;

      if (!imageUrl) throw new BadRequestException();
    }

    Object.assign(existingUser, editUserDto);
    await this.usersEntity.save(existingUser);

    return { status: true, message: '회원 정보가 수정되었습니다.' };
  }

  //-- 유저 탈퇴 --//
  async delete(userId: number): Promise<string> {
    const existingUser = await this.usersEntity.findOne({
      where: { id: userId },
    });

    if (existingUser.profile_image) {
      await this.uploadsService.deleteProfileImage(existingUser.profile_image);
    }

    await this.usersEntity.delete(existingUser.id);

    return '회원탈퇴가 완료되었습니다.';
  }

  // TODO :: 삭제 예정
  async findOne(userId: number): Promise<UsersEntity> {
    return await this.usersEntity.findOne({ where: { id: userId } });
  }
}

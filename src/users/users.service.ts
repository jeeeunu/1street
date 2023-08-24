import {
  Injectable,
  NotFoundException,
  ConflictException,
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

    if (files.length !== 0) {
      const imageUrl = await this.uploadsService.createS3Images(files);
      createUser.profile_image = imageUrl;
    }

    await this.usersEntity.save(createUser);
    return { status: true, message: '회원가입이 완료되었습니다.' };
  }

  //-- 유저 조회 --//
  async find(user_id: number): Promise<userInfo> {
    // TODO :: 장바구니 개수, orders_details 불러오기
    const user = await this.usersEntity
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.orders', 'orders')
      .leftJoinAndSelect('user.qna', 'qna')
      .leftJoinAndSelect('orders.order_details', 'order_details')
      .leftJoinAndSelect('order_details.product', 'product')
      .where('user.id = :id', { id: user_id })
      .loadRelationCountAndMap('user.like_count', 'user.likes') // Add this line
      .loadRelationCountAndMap('orders.orders_count', 'user.orders') // Add this line
      .select([
        'user.id',
        'user.profile_image',
        'user.provider',
        'user.point',
        'orders.id',
        'orders.order_payment_amount',
        'orders.created_at',
        'order_details.id',
        'order_details.order_quantity',
        'product.id',
        'product.product_name',
        'product.product_thumbnail',
        'qna.id',
      ])
      .getOne();

    if (!user) {
      throw new UserNotFoundException();
    }

    return { status: true, results: user };
  }

  //-- 유저 조회 : 좋아요 리스트 --//
  async getLikes(user_id: number): Promise<userInfo> {
    const userLikes = await this.usersEntity
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.likes', 'likes')
      .leftJoinAndSelect('likes.product', 'product')
      .where('user.id = :id', { id: user_id })
      .select([
        'user.id',
        'likes.id',
        'likes.created_at',
        'product.id',
        'product.product_name',
        'product.product_price',
        'product.product_thumbnail',
      ])
      .getOne();

    if (!userLikes) {
      throw new UserNotFoundException();
    }

    return { status: true, results: userLikes };
  }

  //-- 유저 조회 : 주문 리스트 --//
  async getOrders(user_id: number): Promise<userInfo> {
    const userOrders = await this.usersEntity
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.orders', 'orders')
      .leftJoinAndSelect('orders.order_details', 'order_details')
      .leftJoinAndSelect('order_details.product', 'product')
      .where('user.id = :id', { id: user_id })
      .select([
        'user.id',
        'orders.id',
        'orders.order_payment_amount',
        'orders.created_at',
        'order_details.id',
        'order_details.order_quantity',
        'product.id',
        'product.product_name',
        'product.product_thumbnail',
      ])
      .getOne();

    if (!userOrders) {
      throw new UserNotFoundException();
    }

    return { status: true, results: userOrders };
  }

  //-- 유저 조회 : qna 리스트 --//
  async getQnas(user_id: number): Promise<userInfo> {
    const userOrders = await this.usersEntity
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.orders', 'orders')
      .leftJoinAndSelect('user.qna', 'qna')
      .leftJoinAndSelect('orders.order_details', 'order_details')
      .leftJoinAndSelect('order_details.product', 'product')
      .where('user.id = :id', { id: user_id })
      .select([
        'user.id',
        'orders.id',
        'orders.order_payment_amount',
        'orders.created_at',
        'order_details.id',
        'order_details.order_quantity',
        'product.id',
        'product.product_name',
        'product.product_thumbnail',
        'qna.id',
      ])
      .getOne();

    if (!userOrders) {
      throw new UserNotFoundException();
    }

    return { status: true, results: userOrders };
  }

  //-- 유저 수정 --//
  async edit(
    user_id: number,
    editUserDto: EditUserDto,
  ): Promise<ResultableInterface> {
    const existingUser = await this.usersEntity.findOne({
      where: { id: user_id },
    });

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    Object.assign(existingUser, editUserDto);
    await this.usersEntity.save(existingUser);

    return { status: true, message: '회원 정보가 수정되었습니다.' };
  }

  //-- 유저 탈퇴 --//
  async delete(userId: number): Promise<ResultableInterface> {
    const deletedUser = await this.usersEntity.delete(userId);

    if (deletedUser.affected === 0)
      throw new NotFoundException('사용자를 찾지 못했습니다.');

    return { status: true, message: '회원탈퇴가 완료되었습니다.' };
  }

  // TODO :: 삭제 예정
  async findOne(userId: number): Promise<UsersEntity> {
    return await this.usersEntity.findOne({ where: { id: userId } });
  }
}

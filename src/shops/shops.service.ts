import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultableInterface } from '../common/interfaces';
import { RequestUserInterface } from '../users/interfaces';
import { UserService } from '../users/users.service';
import { ShopCreateDto, ShopUpdateDto } from './dto/index';
import { ShopsEntity } from './entities/shops.entity';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(ShopsEntity)
    private shopRepository: Repository<ShopsEntity>,
    private userService: UserService,
  ) {}

  //-- 스토어 아이디로 스토어 찾기 --//
  async find(id: number): Promise<ShopsEntity> {
    try {
      const shop = await this.shopRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      // TODO :: 오류날때 status로 따로 오류를 넘길건지 내장쓸건지
      if (!shop) throw new NotFoundException('스토어가 존재하지 않습니다.');
      return shop;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        '서버 내부 오류로 처리할 수 없습니다. 나중에 다시 시도해주세요.',
      );
    }
  }

  //-- 스토어 만들기 --//
  async create(
    shopData: ShopCreateDto,
    authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    if (!authUser.isAdmin)
      // TODO :: 오류날때 status로 따로 오류를 넘길건지 내장쓸건지
      throw new ForbiddenException('판매자만 스토어를 개설할 수 있습니다.');
    const user = await this.userService.findOne(authUser.user_id);
    const foundShop = await this.shopRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (foundShop)
      // TODO :: 오류날때 status로 따로 오류를 넘길건지 내장쓸건지
      throw new ForbiddenException('스토어는 계정당 1개만 만들 수 있습니다.');
    try {
      await this.shopRepository.save({
        user: { id: user.id },
        ...shopData,
      });
      return { status: true, message: '스토어 생성에 성공했습니다.' };
    } catch (err) {
      // TODO :: 오류날때 status로 따로 오류를 넘길건지 내장쓸건지
      console.log(err.message);
      throw new InternalServerErrorException(
        '서버 내부 오류로 처리할 수 없습니다. 나중에 다시 시도해주세요.',
      );
    }
  }

  //-- 스토어 수정 --//
  async update(
    shopData: ShopUpdateDto,
    authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    const shop = await this.find(shopData.id);
    if (shop.user.id !== authUser.user_id)
      // TODO :: 오류날때 status로 따로 오류를 넘길건지 내장쓸건지
      throw new ForbiddenException('판매자만 스토어를 수정 할 수 있습니다.');
    const updateShop = Object.assign(shop, shopData);
    try {
      await this.shopRepository.save(updateShop);
      return { status: true, message: '스토어 수정에 성공했습니다.' };
    } catch (err) {
      // TODO :: 오류날때 status로 따로 오류를 넘길건지 내장쓸건지
      throw new InternalServerErrorException(
        '서버 내부 오류로 처리할 수 없습니다. 나중에 다시 시도해주세요.',
      );
    }
  }

  //-- 스토어 삭제 --//
  async delete(
    shopId: number,
    authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    const shop = await this.find(shopId);
    if (shop.user.id !== authUser.user_id)
      // TODO :: 오류날때 status로 따로 오류를 넘길건지 내장쓸건지
      throw new ForbiddenException('판매자만 스토어를 삭제 할 수 있습니다.');

    try {
      await this.shopRepository.remove(shop);
      return { status: true, message: '스토어 삭제에 성공했습니다.' };
    } catch (err) {
      // TODO :: 오류날때 status로 따로 오류를 넘길건지 내장쓸건지
      throw new InternalServerErrorException(
        '서버 내부 오류로 처리할 수 없습니다. 나중에 다시 시도해주세요.',
      );
    }
  }
}

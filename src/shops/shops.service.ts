import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopsEntity } from '../common/entities';
import { ResultableInterface } from '../common/interfaces';
import { RequestUserInterface } from '../users/interfaces';
import { UsersService } from '../users/users.service';
import { ShopCreateDto, ShopUpdateDto } from './dtos/index';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(ShopsEntity)
    private shopRepository: Repository<ShopsEntity>,
    private usersService: UsersService,
  ) {}

  //-- 마이페이지 스토어 정보 --//
  async findByUserId(id: number): Promise<ShopsEntity> {
    const shop = await this.shopRepository.findOne({
      where: { user_id: id },
    });
    return shop;
  }

  //-- 스토어 아이디로 스토어 찾기 --//
  async findOne(id: number): Promise<ShopsEntity> {
    try {
      const shop = await this.shopRepository.findOne({
        where: { id },
        relations: ['user'],
      });
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
      throw new ForbiddenException('판매자만 스토어를 개설할 수 있습니다.');
    const user = await this.usersService.findUser(authUser.user_id);
    const foundShop = await this.shopRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (foundShop)
      throw new ForbiddenException('스토어는 계정당 1개만 만들 수 있습니다.');
    await this.shopRepository.insert({
      user: { id: user.id },
      ...shopData,
    });
    return { status: true, message: '스토어 생성에 성공했습니다.' };
  }

  //-- 스토어 수정 --//
  async update(
    shopData: ShopUpdateDto,
    authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    const shop = await this.shopRepository.findOne({
      where: { user_id: authUser.user_id },
    });
    if (!shop) throw new NotFoundException('스토어를 찾을 수 없습니다.');
    const updateShop = Object.assign(shop, shopData);

    await this.shopRepository.save(updateShop);
    return { status: true, message: '스토어 수정에 성공했습니다.' };
  }

  //-- 스토어 삭제 --//
  async delete(authUser: RequestUserInterface): Promise<ResultableInterface> {
    const shop = await this.shopRepository.findOne({
      where: { user_id: authUser.user_id },
    });
    if (!shop) throw new NotFoundException('삭제할 스토어를 찾을 수 없습니다.');

    await this.shopRepository.remove(shop);
    return { status: true, message: '스토어 삭제에 성공했습니다.' };
  }
}

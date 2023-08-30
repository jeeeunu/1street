import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeEntity } from '../common/entities';
import { ProductsService } from '../products/products.service';
import { RequestUserInterface } from '../users/interfaces';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikeEntity)
    private likeRepository: Repository<LikeEntity>,
    private productsService: ProductsService,
  ) {}

  //-- 좋아요 보기 --//
  async findAllLikes(authUser: RequestUserInterface) {
    try {
      const likes = await this.likeRepository.find({
        where: { user: { id: authUser.user_id } },
        relations: ['product'],
      });
      if (!likes)
        throw new NotFoundException('좋아요한 상품이 존재하지 않습니다.');
      return likes;
    } catch (err) {
      throw new InternalServerErrorException(
        '서버 내부 오류로 처리할 수 없습니다. 나중에 다시 시도해주세요.',
      );
    }
  }

  //-- 좋아요 --//
  async create(id: number, authUser: RequestUserInterface) {
    // await this.productsService.findById(id);
    const existingLike = await this.likeRepository.findOne({
      where: {
        user: { id: authUser.user_id },
        product: { id },
      },
    });
    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      return { status: true, message: '좋아요를 취소했습니다.' };
    } else {
      await this.likeRepository.save({
        user: { id: authUser.user_id },
        product: { id },
      });
      return { status: true, message: '좋아요를 눌렀습니다.' };
    }
  }

  //-- 좋아요 삭제 --//
  async delete(id: number, authUser: RequestUserInterface) {
    await this.productsService.findById(id);
    await this.likeRepository.delete({
      user: { id: authUser.user_id },
      product: { id },
    });
    return { status: true, message: '좋아요를 취소하였습니다.' };
  }
}

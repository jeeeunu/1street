import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ResultableInterface } from 'src/common/interfaces';

@Injectable()
export class CartsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async addCart(
    user_id: number,
    product_id: number,
    quantity: number,
  ): Promise<ResultableInterface> {
    await this.cacheManager.set(
      `${user_id}`,
      `${product_id}, ${quantity}`,
      259200,
    );
    return { status: true, message: '상품이 장바구니에 추가되었습니다.' };
  }

  async getCart(user_id: number): Promise<any> {
    const redisClient = this.cacheManager.get(`${user_id}`);
    return redisClient;
  }
}

import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { ResultableInterface } from 'src/common/interfaces';

@Injectable()
export class CartsService {
  constructor(private readonly redisService: RedisService) {}

  async addCart(
    user_id: number,
    product_id: number,
    quantity: number,
  ): Promise<ResultableInterface> {
    const redisClient = this.redisService.getClient();
    await redisClient.hset(`cart:${user_id}`, product_id, quantity);
    await redisClient.expire(`cart:${user_id}`, 259200);
    return { status: true, message: '상품이 장바구니에 추가되었습니다.' };
  }

  async getCart(user_id: number) {
    const redisClient = this.redisService.getClient();
    const cartItems = await redisClient.hgetall(`cart:${user_id}`);
    return cartItems;
  }
}

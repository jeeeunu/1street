import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class CartService {
  constructor(private readonly redisService: RedisService) {}

  async addToCart(user_id: string, product_id: string, quantity: number) {
    const redisClient = this.redisService.getClient();
    await redisClient.hset(`cart:${user_id}`, product_id, quantity);
  }

  async getCart(user_id: string) {
    const redisClient = this.redisService.getClient();
    const cartItems = await redisClient.hgetall(`cart:${user_id}`);
    return cartItems;
  }
}

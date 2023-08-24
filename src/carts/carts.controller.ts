import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CartService } from './carts.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':user_id/add')
  async addToCart(
    @Param('user_id') userId: string,
    @Body('product_id') productId: string,
    @Body('quantity') quantity: number,
  ) {
    await this.cartService.addToCart(userId, productId, quantity);
    return 'Item added to cart successfully.';
  }

  @Get(':user_id')
  async getCart(@Param('user_id') userId: string) {
    const cartItems = await this.cartService.getCart(userId);
    return cartItems;
  }
}

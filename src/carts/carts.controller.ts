import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { AuthUser } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { ResultableInterface } from '../common/interfaces';
import { RequestUserInterface } from '../users/interfaces';

@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async addCart(
    @AuthUser() authUser: RequestUserInterface,
    @Body('product_id') product_id: number,
    @Body('quantity') quantity: number,
  ): Promise<ResultableInterface> {
    return await this.cartsService.addCart(
      authUser.user_id,
      product_id,
      quantity,
    );
  }

  @Get(':user_id')
  @UseGuards(AuthGuard)
  async getCart(@Param('user_id') user_id: number): Promise<any> {
    const cartItems = await this.cartsService.getCart(user_id);
    return cartItems;
  }
}

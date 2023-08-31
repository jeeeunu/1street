import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { AuthUser } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { ResultableInterface } from '../common/interfaces';
import { RequestUserInterface } from '../users/interfaces';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  //-- 장바구니 추가 --//
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

  //-- 장바구니 삭제 --//
  @Delete()
  @UseGuards(AuthGuard)
  async removeCart(
    @AuthUser() authUser: RequestUserInterface,
    @Body('product_id') product_id: number,
  ): Promise<ResultableInterface> {
    return await this.cartsService.removeCart(authUser.user_id, product_id);
  }

  //-- 장바구니 불러오기 --//
  @Get()
  @UseGuards(AuthGuard)
  async getCart(@AuthUser() authUser: RequestUserInterface): Promise<any> {
    return await this.cartsService.getCart(authUser.user_id);
  }

  //-- 장바구니 수정 --//
  @Patch()
  @UseGuards(AuthGuard)
  async updateCartItemQuantity(
    @AuthUser() authUser: RequestUserInterface,
    @Body('product_id') product_id: string,
    @Body('quantity') quantity: number,
  ): Promise<any> {
    return await this.cartsService.updateCartItem(
      authUser.user_id,
      product_id,
      quantity,
    );
  }
}

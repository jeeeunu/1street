import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth.decorator';
import { Order2CreateDto, OrderCreateDto, OrderStatusDto } from './dtos';
import { ResultableInterface } from 'src/common/interfaces';
import { RequestUserInterface } from 'src/users/interfaces';
import { OrdersEntity } from 'src/common/entities';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //-- 장바구니 주문 작성 --//
  @Post('/carts')
  async createOrder(
    @Body() data: Order2CreateDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return this.ordersService.createOrder(data, authUser.user_id);
  }

  //-- 주문 작성 --//
  @Post()
  @UseGuards(AuthGuard)
  async postOrder(
    @Body() data: OrderCreateDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.ordersService.postOrder(data, authUser.user_id);
  }
  // //-- 판매자 주문 확인 --//
  @Get('/seller/list')
  @UseGuards(AuthGuard)
  async sellerGetOrder(
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<any> {
    return await this.ordersService.sellerGetOrder(authUser.user_id);
  }
  //-- 주문 확인 --//
  @Get()
  @UseGuards(AuthGuard)
  async getOrders(
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<OrdersEntity[]> {
    return await this.ordersService.getOrders(authUser.user_id);
  }

  //-- 주문 상세 확인 --//
  @Get('/:order_id')
  @UseGuards(AuthGuard)
  getDetailOrder(
    @AuthUser() authUser: RequestUserInterface,
    @Param('order_id') order_id: number,
  ): Promise<any> {
    return this.ordersService.getDetailOrder(authUser.user_id, order_id);
  }

  // //-- 주문 취소하기 --//
  @Patch('/:order_id/cancel')
  @UseGuards(AuthGuard)
  async cancelOrder(
    @AuthUser() authUser: RequestUserInterface,
    @Param('order_id') order_id: number,
  ): Promise<ResultableInterface> {
    return await this.ordersService.cancelOrder(authUser.user_id, order_id);
  }

  //-- 주문 부분 취소하기 --//
  @Patch('/:order_id/:order_detail_id/select')
  @UseGuards(AuthGuard)
  async partialCancel(
    @AuthUser() authUser: RequestUserInterface,
    @Param('order_id') order_id: number,
    @Param('order_detail_id') order_detail_id: number,
  ): Promise<ResultableInterface> {
    return await this.ordersService.partialCancel(
      order_id,
      order_detail_id,
      authUser.user_id,
    );
  }

  //-- 주문 상태 변경(판매자) --//
  @Patch('/:order_id/seller')
  @UseGuards(AuthGuard)
  async sellerOrder(
    @Req() req: Request,
    @Param('order_id') order_id: number,
    @Body() data: OrderStatusDto,
  ): Promise<ResultableInterface> {
    const authUser: RequestUserInterface = req['user'];
    return await this.ordersService.sellerOrder(authUser, order_id, data);
  }

  //-- 결제 실패시 주문 삭제 --//
  @Delete('/:order_id/fail/delete')
  @UseGuards(AuthGuard)
  async deleteOrder(
    @AuthUser() authUser: RequestUserInterface,
    @Param('order_id') order_id: number,
  ): Promise<ResultableInterface> {
    return await this.ordersService.deleteOrder(authUser.user_id, order_id);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth.decorator';
import { OrderCreateDto, OrderStatusDto, OrderUpdateDto } from './dto';
import { orderInterface } from './interfaces';
import { CustomRequest, ResultableInterface } from 'src/common/interfaces';
import { RequestUserInterface } from 'src/users/interfaces';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //-- 주문 작성 --//
  @Post()
  @UseGuards(AuthGuard)
  async postOrder(@Body() data: OrderCreateDto): Promise<ResultableInterface> {
    return await this.ordersService.postOrder(data);
  }
  //-- 주문 확인 --//
  @Get()
  @UseGuards(AuthGuard)
  async getOrders(): Promise<any> {
    return await this.ordersService.getOrders();
  }
  //-- 주문 상세 확인 --//
  @Get('/:order_id')
  @UseGuards(AuthGuard)
  getDetailOrder(
    @Param('order_id') userOrder: orderInterface,
  ): Promise<ResultableInterface> {
    return this.ordersService.getDetailOrder(userOrder);
  }
  //-- 주문 수정하기 --//
  @Patch('/:order_id')
  @UseGuards(AuthGuard)
  async updateOrder(
    @Param('order_id') order_id: number,
    @Body() data: OrderUpdateDto,
  ): Promise<ResultableInterface> {
    return await this.ordersService.updateOrder(
      order_id,
      data.order_receiver,
      data.order_email,
      data.order_payment_amount,
      data.order_phone,
      data.order_address,
    );
  }
  // //-- 주문 취소하기 --//
  @Patch('/:order_id/cancel')
  @UseGuards(AuthGuard)
  async cancelOrder(
    @Param('order_id') order_id: number,
  ): Promise<ResultableInterface> {
    return await this.ordersService.cancelOrder(order_id);
  }
  //-- 주문 상태 변경(판매자) --//
  @Patch('/:order_id/seller')
  @UseGuards(AuthGuard)
  async sellerOrder(
    @AuthUser() authUser: RequestUserInterface,
    @Param('order_id') order_id: number,
    @Body() data: OrderStatusDto,
  ): Promise<ResultableInterface> {
    return await this.ordersService.sellerOrder(
      authUser.user_id,
      order_id,
      data,
    );
  }
}

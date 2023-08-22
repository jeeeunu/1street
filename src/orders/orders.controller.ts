import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'supertest';
import { OrderCreateDto, OrderStatusDto } from './dtos';
import { ResultableInterface } from 'src/common/interfaces';
import { RequestUserInterface } from 'src/users/interfaces';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //-- 주문 작성 --//
  @Post()
  @UseGuards(AuthGuard)
  async postOrder(
    @Body() data: OrderCreateDto,
    @Req() req: Request,
  ): Promise<ResultableInterface> {
    const authUser: RequestUserInterface = req['user'];
    console.log(authUser);
    return await this.ordersService.postOrder(data, authUser);
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
  getDetailOrder(@Param('order_id') order_id: number): Promise<any> {
    return this.ordersService.getDetailOrder(order_id);
  }
  // //-- 주문 수정하기 --//
  // @Patch('/:order_id')
  // @UseGuards(AuthGuard)
  // async updateOrder(
  //   @Param('order_id') order_id: number,
  //   @Body() data: OrderUpdateDto,
  // ): Promise<ResultableInterface> {
  //   return await this.ordersService.updateOrder(order_id, data);
  // }

  //-- 주문 부분 취소하기 --//

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
    @Req() req: Request,
    @Param('order_id') order_id: number,
    @Body() data: OrderStatusDto,
  ): Promise<ResultableInterface> {
    const authUser: RequestUserInterface = req['user'];
    return await this.ordersService.sellerOrder(authUser, order_id, data);
  }
}

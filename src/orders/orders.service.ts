import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersEntity } from '../common/entities/orders.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderCreateDto, OrderStatusDto } from './dtos';
import { ResultableInterface } from 'src/common/interfaces';
import { RequestUserInterface } from 'src/users/interfaces';
import { UserService } from 'src/users/users.service';
import { OrderDetailsEntity } from './entities/order-detail.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private orderRepository: Repository<OrdersEntity>,
    private userService: UserService,
    @InjectRepository(OrderDetailsEntity)
    private orderDetailRepository: Repository<OrderDetailsEntity>,
  ) {}
  //-- 주문 작성 --//
  async postOrder(
    data: OrderCreateDto,
    authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    const user = await this.userService.findOne(authUser.user_id);
    console.log(user.id);
    const order = await this.orderRepository.save({
      user: { id: user.id },
      ...data,
    });
    console.log(order);
    return { status: true, message: '주문이 완료되었습니다.' };
  }
  //-- 주문 확인 --//
  async getOrders(): Promise<OrdersEntity[]> {
    return await this.orderRepository.find();
  }

  //-- 주문 상세 확인 --//
  async getDetailOrder(order_id: number): Promise<any> {
    const order = await this.orderRepository.findOne({ where: { order_id } });
  }
  //-- 주문 수정하기 --//
  async updateOrder(
    order_id: number,
    order_receiver: string,
    order_email: string,
    order_payment_amount: number,
    order_phone: string,
    order_address: string,
  ): Promise<ResultableInterface> {
    const order = await this.orderRepository.findOne({
      where: { order_id },
    });
    if (!order) {
      throw new NotFoundException('주문이 존재하지 않습니다.');
    }
    order.order_receiver = order_receiver;
    order.order_email = order_email;
    order.order_payment_amount = order_payment_amount;
    order.order_phone = order_phone;
    order.order_address = order_address;
    await this.orderRepository.save(order);
    return { status: true, message: '주문이 수정되었습니다.' };
  }
  //-- 주문 취소하기 --//
  async cancelOrder(order_id: number): Promise<ResultableInterface> {
    const order = await this.orderRepository.findOne({
      where: { order_id },
    });
    if (!order) {
      throw new NotFoundException('주문이 존재하지 않습니다.');
    }
    order.order_status = '0';
    await this.orderRepository.save(order);
    return { status: true, message: '주문이 취소되었습니다.' };
  }
  //-- 주문 상태 변경(판매자) --//
  async sellerOrder(
    authUser: RequestUserInterface,
    order_id: number,
    data: OrderStatusDto,
  ): Promise<ResultableInterface> {
    const order = await this.orderRepository.findOne({
      where: { order_id },
    });
    if (!order) {
      throw new NotFoundException('주문이 존재하지 않습니다.');
    }
    if (order.order_status === '0') {
      throw new NotFoundException('이미 취소된 주문입니다.');
    }
    // const user = await this.userRepository.findOne({ where: { authUser.user_id } });/
    //if (user.seller_flag === false) {
    //  throw new NotFoundException('판매자가 아닙니다.');
    //}
    order.order_status = data.order_status;
    await this.orderRepository.save(order);
    return { status: true, message: '주문상태가 수정되었습니다.' };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersEntity } from './entities/orders.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderCreateDto, OrderStatusDto } from './dto';
import { ResultableInterface } from 'src/common/interfaces';
import { UsersEntity } from 'src/users/entities/users.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private orderRepository: Repository<OrdersEntity>,
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
  ) {}
  //-- 주문 작성 --//
  async postOrder(data: OrderCreateDto): Promise<ResultableInterface> {
    await this.orderRepository.save(data);
    return { status: true, message: '주문이 완료되었습니다.' };
  }
  //-- 주문 확인 --//
  async getOrders(): Promise<OrdersEntity[]> {
    return await this.orderRepository.find();
  }

  //-- 주문 상세 확인 --//
  async getDetailOrder(
    userOrder: OrderCreateDto,
  ): Promise<ResultableInterface> {
    return { status: true, message: '주문이 완료되었습니다.' };
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
    user_id: number,
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
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (user.seller_flag === false) {
      throw new NotFoundException('판매자가 아닙니다.');
    }
    order.order_status = data.order_status;
    await this.orderRepository.save(order);
    return { status: true, message: '주문상태가 수정되었습니다.' };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersEntity } from '../common/entities/orders.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Order2CreateDto, OrderCreateDto, OrderStatusDto } from './dtos';
import { ResultableInterface } from 'src/common/interfaces';
import { RequestUserInterface } from 'src/users/interfaces';
import { UserService } from 'src/users/users.service';
import { OrderDetailsEntity } from './entities/order-detail.entity';
import { CartsService } from 'src/carts/carts.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private orderRepository: Repository<OrdersEntity>,
    private userService: UserService,
    @InjectRepository(OrderDetailsEntity)
    private orderDetailRepository: Repository<OrderDetailsEntity>,
    private cartsService: CartsService,
  ) {}
  //-- 장바구니 주문 작성 --//
  async createOrder(
    data: Order2CreateDto,
    user_id: number,
  ): Promise<ResultableInterface> {
    const carts = await this.cartsService.getCart(user_id);
    console.log(carts);
    if (!carts || carts.length === 0) {
      throw new NotFoundException('장바구니가 비어있습니다.');
    }
    // 여기서 주문 생성 로직을 구현
    // carts 기반으로 주문 생성, 주문 정보를 저장 등을 수행
    const order = await this.orderRepository.save({
      user: { id: user_id },
      order_receiver: data.order_receiver,
      order_phone: data.order_phone,
      order_email: data.order_email,
      order_address: data.order_address,
      order_payment_amount: data.order_payment_amount,
    });

    // 장바구니 항목을 주문 상세로 이동
    const orderDetails: DeepPartial<OrderDetailsEntity>[] = carts.map(
      (carts) => ({
        product: { id: carts.product_id },
        order_quantity: carts.quantity,
        order: { id: order.id },
      }),
    );
    await this.orderDetailRepository.save(orderDetails);
    // 주문 생성 성공 시, 장바구니 비우기
    await this.cartsService.clearCart(user_id);

    return { status: true, message: '주문이 생성되었습니다.' };
  }

  //-- 주문 작성 --//
  async postOrder(
    data: OrderCreateDto,
    user_id: number,
  ): Promise<ResultableInterface> {
    const orderContent = await this.orderRepository.save({
      user: { id: user_id },
      order_receiver: data.order_receiver,
      order_phone: data.order_phone,
      order_email: data.order_email,
      order_address: data.order_address,
      order_payment_amount: data.order_payment_amount,
    });
    console.log(orderContent.id);
    const orderDetails: DeepPartial<OrderDetailsEntity>[] =
      data.order_details.map((detail) => ({
        product: { id: detail.product_id },
        order_quantity: detail.order_quantity,
        order: { id: orderContent.id },
      }));
    await this.orderDetailRepository.save(orderDetails);
    return { status: true, message: '주문이 완료되었습니다.' };
  }
  //-- 주문 확인 --//
  async getOrders(user_id: number): Promise<OrdersEntity[]> {
    return await this.orderRepository.find({
      where: { user: { id: user_id } },
    });
  }

  //-- 주문 상세 확인 --//
  async getDetailOrder(order_id: number): Promise<any> {
    const order = await this.orderRepository.findOne({
      where: { id: order_id },
      relations: ['order_details', 'order_details.product'],
    });
    if (!order) {
      throw new NotFoundException('주문을 찾을 수 없습니다.');
    }
    console.log(order);
    return order;
  }

  //-- 주문 취소하기 --//
  async cancelOrder(
    user_id: number,
    order_id: number,
  ): Promise<ResultableInterface> {
    const order = await this.orderRepository.findOne({
      where: { id: order_id },
      relations: ['user'],
    });
    if (!order) {
      throw new NotFoundException('주문이 존재하지 않습니다.');
    }
    if (order.user.id !== user_id) {
      throw new NotFoundException('권한이 없습니다.');
    }
    if (order.order_status === '0') {
      throw new NotFoundException('이미 취소된 주문 입니다.');
    }
    order.order_status = '0';
    await this.orderRepository.save(order);
    return { status: true, message: '주문이 취소되었습니다.' };
  }

  //-- 주문 부분 취소 --//
  async partialCancel(
    order_id: number,
    order_detail_id: number,
    user_id: number,
  ): Promise<ResultableInterface> {
    console.log(order_detail_id);
    const order = await this.orderRepository.findOne({
      where: { id: order_id },
      relations: ['user', 'order_details', 'order_details.product'],
    });
    console.log(order);
    if (!order) {
      throw new NotFoundException('주문이 존재하지 않습니다.');
    }
    if (order.user.id !== user_id) {
      throw new NotFoundException('권한이 없습니다.');
    }
    const orderDetail = await this.orderDetailRepository.findOne({
      where: { id: order_detail_id },
    });

    if (order.order_details.length <= 1) {
      order.order_status = '0';
      await this.orderRepository.save(order);
    }
    if (!orderDetail) {
      throw new NotFoundException('상세 주문이 존재하지 않습니다.');
    }

    await this.orderDetailRepository.remove(orderDetail);

    return { status: true, message: '선택하신 상세 주문 삭제에 성공했습니다.' };
  }

  //-- 주문 상태 변경(판매자) --//
  async sellerOrder(
    authUser: RequestUserInterface,
    order_id: number,
    data: OrderStatusDto,
  ): Promise<ResultableInterface> {
    const order = await this.orderRepository.findOne({
      where: { id: order_id },
    });
    if (!order) {
      throw new NotFoundException('주문이 존재하지 않습니다.');
    }
    if (order.order_status === '0') {
      throw new NotFoundException('이미 취소된 주문입니다.');
    }
    if (authUser.isAdmin === false) {
      throw new NotFoundException('판매자가 아닙니다.');
    }
    order.order_status = data.order_status;
    await this.orderRepository.save(order);
    return { status: true, message: '주문상태가 수정되었습니다.' };
  }

  // //-- 주문 수정하기 --//
  // async updateOrder(
  //   order_id: number,
  //   data: OrderUpdateDto,
  // ): Promise<ResultableInterface> {
  //   const order = await this.orderRepository.findOne({
  //     where: { order_id },
  //   });
  //   if (!order) {
  //     throw new NotFoundException('주문이 존재하지 않습니다.');
  //   }
  //   order.order_receiver = data.order_receiver;
  //   order.order_email = data.order_email;
  //   order.order_payment_amount = data.order_payment_amount;
  //   order.order_phone = data.order_phone;
  //   order.order_address = data.order_address;
  //   await this.orderRepository.save(order);
  //   const orderProducts = await this.orderDetailRepository.find({
  //     where: { order_id },
  //   });
  //   console.log(orderProducts);
  //   console.log(data.order_details);
  //   // orderProducts = data.order_details;
  //   return { status: true, message: '주문이 수정되었습니다.' };
  // }

  //-- 주문 상세 아이디로 검색하기 --//
  async getDetailOrderById(orderDetailId: number): Promise<any> {
    const orderDetail = await this.orderDetailRepository.findOne({
      where: { id: orderDetailId },
      relations: ['order', 'product', 'product.product_image'],
    });
    if (!orderDetail) {
      throw new NotFoundException('주문을 찾을 수 없습니다.');
    }
    return orderDetail;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentsEntity } from 'src/common/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultableInterface } from 'src/common/interfaces';
import { CreatePaymentDto } from './dtos';
import { PAYMENTSTATUS } from 'src/common/entities/payments.entity';
import { CartsService } from 'src/carts/carts.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentsEntity)
    private paymentsRepository: Repository<PaymentsEntity>,
    private cartsService: CartsService,
  ) {}

  async getPayments(
    user_id: number,
    payment_id: number,
  ): Promise<PaymentsEntity> {
    const payment = await this.paymentsRepository.findOne({
      where: { id: payment_id },
      relations: ['user', 'order'],
    });
    if (payment.user.id !== user_id) {
      throw new NotFoundException('권한이 없습니다.');
    }
    return payment;
  }

  async postPayments(
    data: CreatePaymentDto,
    user_id: number,
  ): Promise<ResultableInterface> {
    const existPayment = await this.paymentsRepository.findOne({
      where: { imp_uid: data.imp_uid },
    });
    if (existPayment) {
      throw new NotFoundException('이미 결제되었습니다.');
    }
    await this.paymentsRepository.save({
      amount: data.amount,
      imp_uid: data.imp_uid,
      merchant_uid: data.merchant_uid,
      order: { id: data.order_id },
      user: { id: user_id },
    });

    // 주문 생성 성공 시, 장바구니 비우기
    await this.cartsService.clearCart(user_id);
    return { status: true, message: '결제가 완료되었습니다.' };
  }

  async cancelPayment(
    payment_id: number,
    user_id: number,
  ): Promise<ResultableInterface> {
    const payment = await this.paymentsRepository.findOne({
      where: { id: payment_id },
    });
    if (payment.status === PAYMENTSTATUS.CANCEL) {
      throw new NotFoundException('이미 취소되었습니다.');
    }
    if (payment.user.id !== user_id) {
      throw new NotFoundException('권한이 없습니다.');
    }
    payment.status = PAYMENTSTATUS.CANCEL;
    await this.paymentsRepository.save(payment);

    return { status: true, message: '결제가 취소되었습니다.' };
  }
}

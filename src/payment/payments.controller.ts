import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth.decorator';
import { PaymentsService } from './payments.service';
import { RequestUserInterface } from 'src/users/interfaces';
import { PaymentsEntity } from 'src/common/entities';
import { CreatePaymentDto } from './dtos';
import { ResultableInterface } from 'src/common/interfaces';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  //-- 결제 확인 --//
  @Get('/:payment_id')
  @UseGuards(AuthGuard)
  async getPayments(
    @AuthUser() authUser: RequestUserInterface,
    @Param('payment_id') payment_id: number,
  ): Promise<PaymentsEntity> {
    return await this.paymentsService.getPayments(authUser.user_id, payment_id);
  }

  //-- 결제 --//
  @Post()
  @UseGuards(AuthGuard)
  async postPayments(
    @Body() data: CreatePaymentDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.paymentsService.postPayments(data, authUser.user_id);
  }

  @Patch('/:payment_id')
  @UseGuards(AuthGuard)
  async cancelPayment(
    @Param('payment_id') payment_id: number,
    @AuthUser() authUser: RequestUserInterface,
  ) {
    return await this.paymentsService.cancelPayment(
      payment_id,
      authUser.user_id,
    );
  }
}

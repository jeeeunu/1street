import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UploadsService } from 'src/uploads/uploads.service';
import {
  PaymentsEntity,
  ProductsEntity,
  ShopsEntity,
  UsersEntity,
} from 'src/common/entities';
import { CartsService } from 'src/carts/carts.service';
import { ProductImageEntity } from 'src/products/entities/product-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentsEntity,
      UsersEntity,
      ShopsEntity,
      ProductsEntity,
      ProductImageEntity,
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, UsersService, UploadsService, CartsService],
})
export class PaymentsModule {}

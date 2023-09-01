import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { ProductsEntity, ShopsEntity, UsersEntity } from '../common/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../users/users.service';
import { UploadsService } from '../uploads/uploads.service';
import { ProductImageEntity } from 'src/products/entities/product-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      ShopsEntity,
      ProductsEntity,
      ProductImageEntity,
    ]),
  ],
  controllers: [CartsController],
  providers: [CartsService, UserService, UploadsService],
  exports: [CartsService],
})
export class CartsModule {}

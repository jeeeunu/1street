import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { CategoryEntity } from './entities/category.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import {
  ProductsEntity,
  ReviewsEntity,
  ShopsEntity,
  UsersEntity,
} from '../common/entities';
import { ProductImageEntity } from './entities/product-image.entity';
import { UploadsService } from 'src/uploads/uploads.service';
import * as multer from 'multer';
import { OrderDetailsEntity } from 'src/orders/entities/order-detail.entity';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(), // 메모리 스토리지에 임시로 저장후 S3에 업로드
    }),
    TypeOrmModule.forFeature([
      ProductsEntity,
      CategoryEntity,
      UsersEntity,
      ShopsEntity,
      ProductImageEntity,
      OrderDetailsEntity,
      ReviewsEntity,
    ]),
  ],
  providers: [ProductsService, UploadsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}

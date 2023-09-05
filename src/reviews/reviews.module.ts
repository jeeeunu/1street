import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsEntity, ShopsEntity } from 'src/common/entities';
import { UsersEntity } from 'src/common/entities/users.entity';
import { UploadsService } from 'src/uploads/uploads.service';
import { ReviewImageEntity } from 'src/uploads/entities/review-image.entity';
import { ShopsService } from 'src/shops/shops.service';
import { UsersService } from 'src/users/users.service';
import { OrderDetailsEntity } from 'src/orders/entities/order-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      ReviewsEntity,
      ReviewImageEntity,
      ShopsEntity,
      OrderDetailsEntity,
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, UploadsService, ShopsService, UsersService],
  exports: [ReviewsService],
})
export class ReviewsModule {}

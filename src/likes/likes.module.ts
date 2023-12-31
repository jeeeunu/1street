import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity, ShopsEntity, UsersEntity } from '../common/entities';
import { ProductsModule } from '../products/products.module';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forFeature([LikeEntity, UsersEntity, ShopsEntity]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}

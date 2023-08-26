import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsEntity, ShopsEntity, UsersEntity } from '../common/entities';
import { ProductImageEntity } from './entities/product_image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductsEntity,
      CategoryEntity,
      UsersEntity,
      ShopsEntity,
      ProductImageEntity,
    ]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}

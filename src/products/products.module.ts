import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopsEntity } from '../shops/entities/shops.entity';
import { ShopsService } from '../shops/shops.service';
import { UsersEntity } from '../users/entities/users.entity';
import { CategoryEntity } from './entities/category.entity';
import { ProductsEntity } from './entities/products.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductsEntity,
      CategoryEntity,
      UsersEntity,
      ShopsEntity,
    ]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}

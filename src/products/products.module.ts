import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { ProductsEntity } from '../common/entities/products.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ShopsEntity, UsersEntity } from '../common/entities';

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

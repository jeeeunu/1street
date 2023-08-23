import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsEntity, ShopsEntity, UsersEntity } from '../common/entities';

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

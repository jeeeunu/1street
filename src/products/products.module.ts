import { Module } from '@nestjs/common';
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
  exports: [ProductsService],
})
export class ProductsModule {}

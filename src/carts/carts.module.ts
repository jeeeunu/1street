import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { UsersEntity } from 'src/common/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}

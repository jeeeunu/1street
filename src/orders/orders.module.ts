import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersEntity } from './entities/_orders.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UserService } from 'src/users/users.service';
import { OrderDetailsEntity } from './entities/order-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersEntity, UsersEntity, OrderDetailsEntity]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, UserService],
})
export class OrdersModule {}

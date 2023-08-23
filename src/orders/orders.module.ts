import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersEntity } from '../common/entities/orders.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/common/entities/users.entity';
import { UserService } from 'src/users/users.service';
import { OrderDetailsEntity } from './entities/order-detail.entity';
import { UploadsService } from 'src/uploads/uploads.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersEntity, UsersEntity, OrderDetailsEntity]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, UserService, UploadsService],
})
export class OrdersModule {}

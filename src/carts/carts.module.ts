import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { UsersEntity } from '../common/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../users/users.service';
import { UploadsService } from '../uploads/uploads.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [CartsController],
  providers: [CartsService, UserService, UploadsService],
})
export class CartsModule {}

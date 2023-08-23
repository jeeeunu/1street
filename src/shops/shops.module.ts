import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../users/users.service';
import { ShopsEntity, UsersEntity } from '../common/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ShopsEntity, UsersEntity])],
  providers: [ShopsService, UserService],
  controllers: [ShopsController],
})
export class ShopsModule {}

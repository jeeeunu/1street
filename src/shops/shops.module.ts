import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { ShopsEntity } from '../common/entities/shops.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../common/entities/users.entity';
import { UserService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShopsEntity, UsersEntity])],
  providers: [ShopsService, UserService],
  controllers: [ShopsController],
})
export class ShopsModule {}

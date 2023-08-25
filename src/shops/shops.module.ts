import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../users/users.service';
import { ShopsEntity, UsersEntity } from '../common/entities';
import { UploadsService } from 'src/uploads/uploads.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShopsEntity, UsersEntity])],
  providers: [ShopsService, UserService, UploadsService],
  controllers: [ShopsController],
})
export class ShopsModule {}

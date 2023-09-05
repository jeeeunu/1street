import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { ShopsEntity, UsersEntity } from '../common/entities';
import { UploadsService } from 'src/uploads/uploads.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShopsEntity, UsersEntity])],
  providers: [ShopsService, UsersService, UploadsService],
  controllers: [ShopsController],
  exports: [ShopsService],
})
export class ShopsModule {}

import { Module } from '@nestjs/common';
import { QnasController } from './qnas.controller';
import { QnasService } from './qnas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/common/entities/users.entity';
import { QnasEntity } from 'src/common/entities/qnas.entity';
import { UploadsService } from 'src/uploads/uploads.service';
import { UsersService } from 'src/users/users.service';
import { ProductsEntity, ShopsEntity } from 'src/common/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QnasEntity,
      UsersEntity,
      ProductsEntity,
      ShopsEntity,
    ]),
  ],
  controllers: [QnasController],
  providers: [QnasService, UploadsService, UsersService],
})
export class QnasModule {}

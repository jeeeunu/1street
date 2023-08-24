import { Module } from '@nestjs/common';
import { QnasController } from './qnas.controller';
import { QnasService } from './qnas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/common/entities/users.entity';
import { QnasEntity } from 'src/common/entities/qnas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QnasEntity, UsersEntity])],
  controllers: [QnasController],
  providers: [QnasService],
})
export class QnasModule {}

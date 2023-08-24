import { Module } from '@nestjs/common';
import { QnasController } from './qnas.controller';
import { QnasService } from './qnas.service';
import { QnasEntity } from './entities/qnas.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/common/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QnasEntity, UsersEntity])],
  controllers: [QnasController],
  providers: [QnasService],
})
export class QnasModule {}

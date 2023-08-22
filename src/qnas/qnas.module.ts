import { Module } from '@nestjs/common';
import { QnasController } from './qnas.controller';
import { QnaService } from './qnas.service';
import { QnasEntity } from './entities/qnas.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([QnasEntity])],
  controllers: [QnasController],
  providers: [QnaService],
})
export class QnasModule {}

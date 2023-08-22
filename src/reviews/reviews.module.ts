import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsEntity } from 'src/common/entities';
import { UsersEntity } from 'src/common/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewsEntity, UsersEntity])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}

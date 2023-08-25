import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsEntity } from 'src/common/entities';
import { UsersEntity } from 'src/common/entities/users.entity';
import { UploadsService } from 'src/uploads/uploads.service';
import { ReviewImageEntity } from 'src/uploads/entities/review-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, ReviewsEntity, ReviewImageEntity]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, UploadsService],
})
export class ReviewsModule {}

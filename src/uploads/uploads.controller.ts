import {
  Controller,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { ResultableInterface } from 'src/common/interfaces';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  //-- 이미지 저장 --//
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadReviewImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('review_id') reviewId?: number,
  ): Promise<ResultableInterface> {
    if (reviewId) {
      return this.uploadsService.uploadReviewImages(reviewId, files);
    }
  }
}

import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { ResultableInterface } from 'src/common/interfaces';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('reviews')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadReviewImages(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ResultableInterface> {
    return this.uploadsService.uploadReviewImages(files);
  }
}

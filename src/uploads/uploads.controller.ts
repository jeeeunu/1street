import {
  Controller,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
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
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('review_id') reviewId?: number,
  ): Promise<ResultableInterface> {
    if (!files || files.length === 0) {
      throw new BadRequestException('파일을 업로드 해주세요.');
    }

    if (reviewId) {
      return this.uploadsService.createReviewImages(reviewId, files);
    }
    throw new NotFoundException('잘못된 접근입니다.');
  }

  //-- 이미지 수정 --//
  @Post('edit')
  @UseInterceptors(FilesInterceptor('files'))
  async editImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('image_id') imageId?: number,
  ): Promise<ResultableInterface> {
    if (!files || files.length === 0) {
      throw new BadRequestException('파일을 업로드 해주세요.');
    }

    if (imageId) {
      return this.uploadsService.editReviewImage(imageId, files);
    }
    throw new NotFoundException('잘못된 접근입니다.');
  }

  //-- 이미지 삭제 --//
  @Post('delete')
  @UseInterceptors(FilesInterceptor('files'))
  async deleteImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('image_id') imageId?: number,
  ): Promise<ResultableInterface> {
    if (imageId) {
      return this.uploadsService.deleteReviewImage(imageId);
    }
    throw new NotFoundException('잘못된 접근입니다.');
  }
}

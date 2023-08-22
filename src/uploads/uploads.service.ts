import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultableInterface } from 'src/common/interfaces';
import { ReviewImageEntity } from '../reviews/entities/review-image.entity';

@Injectable()
export class UploadsService {
  private s3: AWS.S3 = new AWS.S3(); // S3 초기화
  private bucketName = '1street';

  constructor(
    @InjectRepository(ReviewImageEntity)
    private readonly reviewImageEntity: Repository<ReviewImageEntity>,
  ) {}

  //-- 공통 : S3 생성키 --//
  private async generateKey(): Promise<string> {
    const uniqueId = uuidv4();
    return `uploads-reviews/${uniqueId}`;
  }

  //-- 공통 : S3 저장 후 eTag 반환 --//
  private async uploadPromise(
    file: Express.Multer.File,
    key: string,
  ): Promise<string> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
    };

    const response = await this.s3.putObject(params).promise();
    return response.ETag;
  }

  //-- 공통 : S3 삭제 --//
  private async deleteFile(key: string): Promise<void> {
    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }

  //-- 이미지 저장 : 리뷰이미지 저장 --//
  async createReviewImages(
    reviewId: number,
    files: Express.Multer.File[],
  ): Promise<ResultableInterface> {
    try {
      const uploadPromises: Promise<void>[] = files.map(async (file) => {
        const key = await this.generateKey();
        const eTag = await this.uploadPromise(file, key);

        const uploadFile = new ReviewImageEntity();
        uploadFile.review_id = reviewId;
        uploadFile.url = key;
        uploadFile.original_name = file.originalname;
        uploadFile.encoding = file.encoding;
        uploadFile.mime_type = file.mimetype;
        uploadFile.size = file.size;
        uploadFile.e_tag = eTag;

        await this.reviewImageEntity.save(uploadFile);
      });

      await Promise.all(uploadPromises);
      return {
        status: true,
        message: `${files.length} 개 파일 업로드 완료`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        '서버 내부 오류로 처리할 수 없습니다. 나중에 다시 시도해주세요.',
      );
    }
  }

  //-- 이미지 수정 : 리뷰이미지 수정 --//
  async editReviewImage(
    imageId: number,
    files: Express.Multer.File[],
  ): Promise<ResultableInterface> {
    try {
      // 기존 이미지 정보 조회
      const existingImage = await this.reviewImageEntity.findOne({
        where: { id: imageId },
      });

      if (!existingImage) {
        throw new NotFoundException('해당 이미지를 찾을 수 없습니다.');
      }

      const editPromises: Promise<void>[] = files.map(async (file) => {
        await this.deleteFile(existingImage.url);

        const key = await this.generateKey();
        const eTag = await this.uploadPromise(file, key);

        existingImage.url = key;
        existingImage.original_name = file.originalname;
        existingImage.encoding = file.encoding;
        existingImage.mime_type = file.mimetype;
        existingImage.size = file.size;
        existingImage.e_tag = eTag;

        await this.reviewImageEntity.save(existingImage);
      });

      await Promise.all(editPromises);

      return {
        status: true,
        message: '이미지 업데이트가 완료되었습니다.',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        '서버 내부 오류로 처리할 수 없습니다. 나중에 다시 시도해주세요.',
      );
    }
  }
}

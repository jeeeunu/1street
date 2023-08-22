import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultableInterface } from 'src/common/interfaces';
import { ReviewImageEntity } from '../reviews/entities/review-image.entity';
@Injectable()
export class UploadsService {
  private s3: AWS.S3 = new AWS.S3(); // S3 초기화

  constructor(
    @InjectRepository(ReviewImageEntity)
    private readonly reviewImageEntity: Repository<ReviewImageEntity>,
  ) {}

  //-- 공통 : S3 저장 후 eTag 반환 --//
  private async uploadPromise(
    file: Express.Multer.File,
    key: string,
  ): Promise<string> {
    const bucketName = '1street';
    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
    };

    const response = await this.s3.putObject(params).promise();
    return response.ETag;
  }

  //-- 이미지 저장 : 리뷰이미지 저장 --//
  async uploadReviewImages(
    reviewId: number,
    files: Express.Multer.File[],
  ): Promise<ResultableInterface> {
    try {
      const uploadPromises: Promise<void>[] = files.map(async (file) => {
        const timestamp = new Date().getTime();
        const uniqueId = uuidv4();
        const key = `uploads-reviews/${timestamp}__${uniqueId}`;

        const eTag = await this.uploadPromise(file, key);

        const uploadFile = new ReviewImageEntity();
        uploadFile.review_id = reviewId;
        uploadFile.url = `S3_URL/${key}`;
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
    } catch {
      throw new InternalServerErrorException(
        '서버 내부 오류로 처리할 수 없습니다. 나중에 다시 시도해주세요.',
      );
    }
  }
}

import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewImageEntity } from '../reviews/entities/review-image.entity';

@Injectable()
export class UploadsService {
  private s3: AWS.S3 = new AWS.S3(); // S3 초기화

  constructor(
    @InjectRepository(ReviewImageEntity)
    private readonly reviewImageEntity: Repository<ReviewImageEntity>,
  ) {}

  async uploadReviewImages(files: Express.Multer.File[]) {
    try {
      const bucketName = '1street';
      const uploadPromises = files.map(async (file) => {
        const key = `uploads-reviews/${file.originalname}`;
        const params: AWS.S3.PutObjectRequest = {
          Bucket: bucketName,
          Key: key,
          Body: file.buffer,
        };
        await this.s3.putObject(params).promise();
        const response = await this.s3.putObject(params).promise(); // S3에 업로드된 ETag 값을 받아옴

        const uploadFile = new ReviewImageEntity();
        uploadFile.e_tag = response.ETag;
        uploadFile.original_name = file.originalname;
        uploadFile.encoding = file.encoding;
        uploadFile.mime_type = file.mimetype;
        uploadFile.size = file.size;
        uploadFile.url = `S3_URL/${key}`;

        await this.reviewImageEntity.save(uploadFile);
      });
      await Promise.all(uploadPromises);
      return { status: true, message: `${files.length} 개의 파일 업로드 완료` };
    } catch (err) {
      console.error(err);
    }
  }
}

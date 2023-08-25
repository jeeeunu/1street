import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  private s3: AWS.S3 = new AWS.S3({ region: 'ap-northeast-2' }); // S3 초기화
  private bucketName = '1street';

  //-- 공통 : S3 저장 후 eTag 반환 --//
  private async uploadPromise(
    file: Express.Multer.File,
    key: string,
  ): Promise<string> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ACL: 'public-read-write',
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

  //-- 이미지 저장 : 유저 프로필 --//
  async createS3Images(files: Express.Multer.File[]): Promise<string> {
    let key: string;

    const uploadPromises: Promise<void>[] = files.map(async (file) => {
      const uniqueId = uuidv4();
      key = `uploads-profile/${uniqueId}`; // Assign the value to the key variable
      const eTag = await this.uploadPromise(file, key);
    });

    await Promise.all(uploadPromises);
    return `https://1street.s3.ap-northeast-2.amazonaws.com/${key}`; // Use the
  }

  //-- 이미지 수정 : 유저 프로필 --//
  async editS3Images(
    url: string,
    files: Express.Multer.File[],
  ): Promise<string> {
    const baseUrl = 'https://1street.s3.ap-northeast-2.amazonaws.com/';
    const fileKey = url.replace(baseUrl, '');
    await this.deleteFile(fileKey);

    let key: string;
    const uploadPromises: Promise<void>[] = files.map(async (file) => {
      const uniqueId = uuidv4();
      key = `uploads-profile/${uniqueId}`; // Assign the value to the key variable
      const eTag = await this.uploadPromise(file, key);
    });

    await Promise.all(uploadPromises);
    return `https://1street.s3.ap-northeast-2.amazonaws.com/${key}`; // Use the
  }

  //-- 이미지 저장 : 리뷰 이미지 --//
  async createS3ImagesDetails(files: Express.Multer.File[]): Promise<any> {
    const uploadPromises: Promise<object>[] = files.map(async (file) => {
      const uniqueId = uuidv4();
      const key = `uploads-reviews/${uniqueId}`;
      const eTag = await this.uploadPromise(file, key);

      return {
        imageUrl: `https://1street.s3.ap-northeast-2.amazonaws.com/${key}`,
        originalName: file.originalname,
        eTag: eTag,
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages;
  }
}

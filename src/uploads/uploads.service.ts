import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';

@Injectable()
export class UploadsService {
  private s3: AWS.S3 = new AWS.S3({ region: 'ap-northeast-2' }); // S3 초기화
  private bucketName = '1street';

  //-- 공통 : S3 저장 --//
  private async uploadPromise(file: Express.Multer.File, key: string) {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ACL: 'public-read-write',
    };

    await this.s3.putObject(params).promise();
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
  async createProfileImage(files: Express.Multer.File[]): Promise<string> {
    let key: string;

    const uploadPromises: Promise<void>[] = files.map(async (file) => {
      const uniqueId = uuidv4();
      key = `uploads-profile/${uniqueId}`;

      const resizedImageBuffer = await sharp(file.buffer)
        .resize(200, 200)
        .toBuffer();

      file.buffer = resizedImageBuffer;

      await this.uploadPromise(file, key);
    });

    await Promise.all(uploadPromises);
    return `https://1street.s3.ap-northeast-2.amazonaws.com/${key}`;
  }

  //-- 이미지 수정 : 유저 프로필 --//
  async updateProfileImage(
    url: string,
    files: Express.Multer.File[],
  ): Promise<string> {
    const baseUrl = 'https://1street.s3.ap-northeast-2.amazonaws.com/';
    const fileKey = url.replace(baseUrl, '');
    console.log(fileKey);
    await this.deleteFile(fileKey);

    let key: string;
    const uploadPromises: Promise<void>[] = files.map(async (file) => {
      const uniqueId = uuidv4();
      key = `uploads-profile/${uniqueId}`;

      const resizedImageBuffer = await sharp(file.buffer)
        .resize(200, 200)
        .toBuffer();

      file.buffer = resizedImageBuffer;

      await this.uploadPromise(file, key);
    });

    await Promise.all(uploadPromises);
    return `https://1street.s3.ap-northeast-2.amazonaws.com/${key}`;
  }

  //-- 이미지 삭제 -//
  async deleteImage(url: string): Promise<string> {
    const baseUrl = 'https://1street.s3.ap-northeast-2.amazonaws.com/';
    const fileKey = url.replace(baseUrl, '');
    await this.deleteFile(fileKey);
    return '이미지 파일 삭제 완료';
  }

  //-- 이미지 저장 : 상품 이미지 --//
  async createProductImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises: Promise<string>[] = files.map(async (file) => {
      const uniqueId = uuidv4();
      const key = `uploads-product/${uniqueId}`;

      const resizedImageBuffer = await sharp(file.buffer)
        .resize(400, 400)
        .toBuffer();

      file.buffer = resizedImageBuffer;

      await this.uploadPromise(file, key);
      return `https://1street.s3.ap-northeast-2.amazonaws.com/${key}`;
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  }

  //-- 이미지 저장 : 리뷰 이미지 --//
  async createReviewImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises: Promise<string>[] = files.map(async (file) => {
      const uniqueId = uuidv4();
      const key = `uploads-reviews/${uniqueId}`;

      const resizedImageBuffer = await sharp(file.buffer)
        .resize(200, 200)
        .toBuffer();

      file.buffer = resizedImageBuffer;

      await this.uploadPromise(file, key);
      return `https://1street.s3.ap-northeast-2.amazonaws.com/${key}`;
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  }
}

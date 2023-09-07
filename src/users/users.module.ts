import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersEntity } from '../common/entities/users.entity';
import { UploadsService } from 'src/uploads/uploads.service';
import * as cookieParser from 'cookie-parser';
import * as multer from 'multer';
import { AuthController } from 'src/auth/auth.controller';
import { ShopsEntity } from 'src/common/entities';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(), // 메모리 스토리지에 임시로 저장후 S3에 업로드
    }),
    TypeOrmModule.forFeature([UsersEntity, ShopsEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UploadsService],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes(AuthController);
  }
}

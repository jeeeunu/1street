// auth.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import { UsersModule } from '../users/users.module';
import { UsersEntity } from '../common/entities/users.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { ShopsEntity } from 'src/common/entities';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'DB_JWT_SECRET_KEY',
      signOptions: { expiresIn: '2h' },
    }),
    TypeOrmModule.forFeature([UsersEntity, ShopsEntity]),
  ],
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes(AuthController);
  }
}

import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersEntity } from './common/entities/users.entity';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { QnasModule } from './qnas/qnas.module';
import { OrdersModule } from './orders/orders.module';
import { OrdersEntity } from './common/entities/orders.entity';
import { ShopsModule } from './shops/shops.module';
import { ProductsModule } from './products/products.module';
import { LikesModule } from './likes/likes.module';
import { AuthenticationMiddleware } from './auth/auth.middleware';
import { ReviewsModule } from './reviews/reviews.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    //-- TypeOrmModule --//
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),

    //-- jwt --//
    JwtModule.register({
      secret: process.env.DB_JWT_SECRET_KEY,
    }),

    AuthModule,
    UsersModule,
    QnasModule,
    ReviewsModule,
    OrdersModule,
    ShopsModule,
    ProductsModule,
    LikesModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}

import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { QnasModule } from './qnas/qnas.module';
import { OrdersModule } from './orders/orders.module';
import { ShopsModule } from './shops/shops.module';
import { ProductsModule } from './products/products.module';
import { LikesModule } from './likes/likes.module';
import { AuthenticationMiddleware } from './auth/auth.middleware';
import { ReviewsModule } from './reviews/reviews.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UploadsModule } from './uploads/uploads.module';
import { CartsModule } from './carts/carts.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ShopsEntity, UsersEntity } from './common/entities';

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
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
    }),

    TypeOrmModule.forFeature([UsersEntity, ShopsEntity]),

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
    CartsModule,
    //-- Redis --//
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          ttl: 259200,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}

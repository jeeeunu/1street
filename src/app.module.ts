import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersEntity } from './users/entities/users.entity';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { ShopsModule } from './shops/shops.module';
import { ProductsController } from './products/products.controller';
import { ProductsModule } from './products/products.module';
import { LikesService } from './likes/likes.service';
import { LikesModule } from './likes/likes.module';
import { AuthenticationMiddleware } from './auth/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
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
    }),

    //-- jwt --//
    JwtModule.register({
      secret: process.env.DB_JWT_SECRET_KEY,
    }),

    AuthModule,
    UsersModule,
    ShopsModule,
    ProductsModule,
    LikesModule,
  ],
  controllers: [AppController, ProductsController],
  providers: [AppService, GoogleStrategy, LikesService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersEntity } from './users/entities/users.entity';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { OrdersModule } from './orders/orders.module';
import { OrdersEntity } from './orders/entities/orders.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, OrdersEntity]),
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
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}

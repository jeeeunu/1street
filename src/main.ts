// main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyCustomValidationException } from './common/exceptions/my-custom-validation.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //-- Pipes --//
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //  DTO에 없은 속성은 무조건 거름
      forbidNonWhitelisted: true, // 전달하는 요청 값 중에 정의 되지 않은 값이 있으면 Error를 발생
      transform: true, // 네트워크를 통해 들어오는 데이터는 일반 JavaScript 객체입니다. 객체를 자동으로 DTO로 변환을 원하면 transform 값을 true로 설정
      disableErrorMessages: true, // Error Message를 표시 여부 설정
      transformOptions: { enableImplicitConversion: true }, // 자동 변환 옵션
      exceptionFactory: (errors) => {
        return new MyCustomValidationException(errors); // 커스텀 예외 클래스를 생성하고 반환
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();

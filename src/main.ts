import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { initSwagger } from './core/swagger/swagger-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // api 버전 추가
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // 스웨거 시작
  initSwagger(app);
  await app.listen(3000);
}
bootstrap();

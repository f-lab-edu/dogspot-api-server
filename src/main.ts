import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { initSwagger } from './core/swagger/swagger-config';
import { WinstonLogger } from './utils/logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: WinstonLogger, // replacing logger
  });
  
  // api 버전 추가
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // 스웨거 시작
  initSwagger(app);
  await app.listen(3000);
}
bootstrap();

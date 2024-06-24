import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initSwagger } from './core/swagger/swagger-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 스웨거 시작
  initSwagger(app);
  await app.listen(3000);
}
bootstrap();

import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

/**
 * 스웨거 설정 파일
 */

// Swagger 설정을 위한 함수
export const initSwagger = async (app: INestApplication) => {
  const location = process.env.MODE;

  // DocumentBuilder를 사용하여 Swagger 설정 빌드
  const builder = new DocumentBuilder()
    .setTitle('Dog Spot API SERVER')
    .setDescription('Swagger API description') // TODO: API 설명문서 작성하기
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'accessToken',
    );

  // 환경 변수에 따른 서버 URL 추가
  if (location === 'mod') {
    builder.addServer('https://dogspot.site/api');
  } else {
    builder.addServer('http://localhost:3000'); // 기본 로컬 서버 URL 추가
  }

  // Swagger 설정 빌드 완료
  const swaggerConfig = builder.build();

  // Swagger 문서 생성 및 설정
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, swaggerDocument, swaggerOptions);
};

// Swagger 커스텀 옵션 설정
export const swaggerOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    defaultModelsExpandDepth: 1, // -1이면 페이지 하단에 DTO 목록 표시 안함 (기본값도 표시 X)
    docExpansion: 'none', // 페이지 접속 시 자동 상세보기 off
    persistAuthorization: true, // 페이지 새로고침해도 토큰 유지
    tagsSorter: 'alpha', // 태그 정렬
    operationsSorter: 'alpha', // 태그 내 함수 순서: 'alpha': abc순, 'method': HTTP method별 분류
    displayRequestDuration: true, // HTTP request 시간 표시
    showCommonExtensions: true,
    showExtensions: true,
  },
};

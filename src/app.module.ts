import { MiddlewareConsumer, Module, NestModule, Logger } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { walksBoardModule } from './domains/walks_board/walks-board.module';
import { KafkaModule } from './domains/kafka/kafka.module';

import { AuthModule } from './domains/auth/auth.module';
import { LoggerContextMiddleware } from './core/middleware/LoggerContextMiddleware';
import { AllExceptionsFilter } from './core/middleware/ExceptionsHandler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? 'dev.env' : 'prod.env',
    }),
    walksBoardModule,
    AuthModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}

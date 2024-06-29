import { MiddlewareConsumer, Module, NestModule, Logger } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { walksBoardModule } from './domains/walks_board/walks-board.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './domains/auth/auth.module';
import { LoggerContextMiddleware } from './core/middleware/LoggerContextMiddleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
    }),
    walksBoardModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}

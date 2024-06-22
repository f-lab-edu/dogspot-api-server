import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { walksBoardModule } from './domains/walks_board/walks-board.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
    }),
    walksBoardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

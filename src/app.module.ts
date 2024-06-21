import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { walksBoardModule } from './domains/walks_board/walks-board.module';

@Module({
  imports: [
    walksBoardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

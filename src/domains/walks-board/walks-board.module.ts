import { Module } from '@nestjs/common';

import { BoardRepository } from './repositories/walks-board.repository';
import { Boardcontroller } from './walks-board.controller';
import { BoardService } from './walks-board.service';
import { KafkaModule } from '../kafka/kafka.module';
import { FileService } from '../file/file.service';

@Module({
  imports: [KafkaModule],
  controllers: [Boardcontroller],
  providers: [BoardService, BoardRepository, FileService],
  exports: [BoardService],
})
export class walksBoardModule {}

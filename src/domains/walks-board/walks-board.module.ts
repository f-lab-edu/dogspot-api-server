import { Module } from '@nestjs/common';

import { BoardRepository } from './repositories/walks-board.repository';
import { Boardcontroller } from './walks-board.controller';
import { BoardService } from './walks-board.service';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  controllers: [Boardcontroller],
  providers: [BoardService, BoardRepository],
  exports: [BoardService],
})
export class walksBoardModule {}

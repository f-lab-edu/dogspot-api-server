import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaService } from './kafka.walks-push.service';

@Module({
  imports: [ConfigModule],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
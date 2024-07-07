import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Topic } from './helpers/constants';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(Topic.WALKS_PUSH);
    await this.kafkaClient.connect();
  }
  async sendMessage(topic: string, message: any) {
    const result = await this.kafkaClient.send(topic, message);
    console.log('result: ', result);

    return result;
  }
}

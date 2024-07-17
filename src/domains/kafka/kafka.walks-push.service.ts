import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { Topic } from './helpers/constants';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(private readonly configService: ConfigService) {
    const brokers = [process.env.KAFKA_URL];
    const groupId = process.env.KAFKA_GROUP_ID;

    this.kafka = new Kafka({ brokers });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: Topic.WALKS_PUSH, fromBeginning: true });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async sendMessage(topic: string, message: any) {
    const result = await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    return result;
  }

  async consumeMessages(topic: string, callback: (message: string) => void) {
    await this.consumer.subscribe({ topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        callback(message.value.toString());
      },
    });
  }
}

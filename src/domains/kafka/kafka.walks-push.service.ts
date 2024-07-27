import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, Consumer, Partitioners } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { Topic } from './helpers/constants';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(private readonly configService: ConfigService) {
    const brokers = [this.configService.get<string>('KAFKA_URL')];
    const groupId = this.configService.get<string>('KAFKA_GROUP_ID');
    console.log('groupId: ', groupId);

    if (!groupId) {
      throw new Error(
        'KAFKA_GROUP_ID is not defined in environment variables.',
      );
    }

    this.kafka = new Kafka({ brokers });
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    }); // Use LegacyPartitioner
    this.consumer = this.kafka.consumer({ groupId });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: Topic.WALKS_PUSH,
      fromBeginning: true,
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async sendMessage(topic: string, message: any) {
    console.log('sendMessage!!!!!!!!', topic);
    
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

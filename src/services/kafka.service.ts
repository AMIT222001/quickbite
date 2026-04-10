import { Kafka, Producer } from 'kafkajs';
import { env } from '../config/index.js';
import logger from '../config/logger.js';

class KafkaService {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'quickbite-backend',
      brokers: [env.KAFKA_BROKER],
    });
    this.producer = this.kafka.producer();
  }

  public async connect(): Promise<void> {
    try {
      await this.producer.connect();
      logger.info('Kafka Producer connected');
    } catch (error) {
      logger.error({ error }, 'Failed to connect Kafka Producer');
    }
  }

  public async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }

  public async sendOrderStatusUpdate(orderId: string, status: string): Promise<void> {
    try {
      await this.producer.send({
        topic: 'order-status-updates',
        messages: [
          {
            key: orderId,
            value: JSON.stringify({ orderId, status, timestamp: new Date() }),
          },
        ],
      });
      logger.debug({ orderId, status }, 'Sent order status update to Kafka');
    } catch (error) {
      logger.error({ error, orderId, status }, 'Failed to send order status update to Kafka');
    }
  }
}

export const kafkaService = new KafkaService();

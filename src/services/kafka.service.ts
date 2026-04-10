import { Kafka, Producer, Consumer, EachMessageHandler } from 'kafkajs';
import { env } from '../config/index.js';
import logger from '../config/logger.js';
import { KafkaClientIDs } from '../constants/index.js';

class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, Consumer> = new Map();
  private isProducerConnected = false;

  constructor() {
    this.kafka = new Kafka({
      clientId: KafkaClientIDs.BACKEND,
      brokers: [env.KAFKA_BROKER],
    });
    this.producer = this.kafka.producer();
  }

  /**
   * Connect producer and ensure it's ready
   */
  public async connect(): Promise<void> {
    try {
      if (!this.isProducerConnected) {
        await this.producer.connect();
        this.isProducerConnected = true;
        logger.info('Kafka Producer connected');
      }
    } catch (error) {
      logger.error({ error }, 'Failed to connect Kafka Producer');
      throw error;
    }
  }

  /**
   * Disconnect producer and all consumers
   */
  public async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      this.isProducerConnected = false;
      
      for (const consumer of this.consumers.values()) {
        await consumer.disconnect();
      }
      this.consumers.clear();
      
      logger.info('Kafka disconnected');
    } catch (error) {
      logger.error({ error }, 'Error during Kafka disconnect');
    }
  }

  /**
   * Generic method to emit a message to a topic
   */
  public async emit(topic: string, value: any, key?: string): Promise<void> {
    try {
      if (!this.isProducerConnected) {
        await this.connect();
      }

      await this.producer.send({
        topic,
        messages: [
          {
            key,
            value: typeof value === 'string' ? value : JSON.stringify({
              ...value,
              timestamp: new Date(),
            }),
          },
        ],
      });
      
      logger.debug({ topic, key }, 'Sent message to Kafka');
    } catch (error) {
      logger.error({ error, topic, key }, 'Failed to send message to Kafka');
      throw error;
    }
  }

  /**
   * Generic method to subscribe to a topic
   */
  public async subscribe(groupId: string, topic: string, onMessage: EachMessageHandler): Promise<void> {
    try {
      const consumer = this.kafka.consumer({ groupId });
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: false });
      
      await consumer.run({
        eachMessage: onMessage,
      });

      this.consumers.set(`${groupId}-${topic}`, consumer);
      logger.info({ groupId, topic }, 'Kafka Consumer subscribed');
    } catch (error) {
      logger.error({ error, groupId, topic }, 'Failed to subscribe Kafka Consumer');
      throw error;
    }
  }

  /**
   * @deprecated Use emit() with KafkaTopics.ORDER_STATUS_UPDATES
   */
  public async sendOrderStatusUpdate(orderId: string, status: string): Promise<void> {
    await this.emit('order-status-updates', { orderId, status }, orderId);
  }
}

export const kafkaService = new KafkaService();

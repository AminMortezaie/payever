import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Queues } from './common/enums';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // Create both HTTP and Microservice instances
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Setup HTTP server for health checks
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  // Setup RabbitMQ connection
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
      queue: Queues.DAILY_SALES_REPORT,
      queueOptions: {
        durable: true
      },
    },
  });

  // Start both HTTP and Microservice
  await app.startAllMicroservices();
  await app.listen(3002);
  
  console.log('🚀 Email service is running on http://localhost:3002');
}

// Void the promise to handle the floating promise warning
void bootstrap();

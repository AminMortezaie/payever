import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HealthModule } from './health/health.module';
import { Queues } from './common/enums';
import { EmailService } from './email/email.service';
import { EmailConsumer } from './email/email.consumer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
          queue: Queues.DAILY_SALES_REPORT,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    HealthModule,
  ],
  controllers: [EmailConsumer],
  providers: [EmailService],
})
export class AppModule {}

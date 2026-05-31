import {Controller, Logger} from '@nestjs/common';
import {EventPattern, Payload} from '@nestjs/microservices';
import {EmailService} from './email.service';
import {ReportDto} from './dto/report.dto';
import { Queues } from '../common/enums';

@Controller()
export class EmailConsumer {
    private readonly logger = new Logger(EmailConsumer.name);
    constructor(private readonly emailService: EmailService) {}

    @EventPattern(Queues.DAILY_SALES_REPORT)
    handleDailySalesReport(@Payload() data: ReportDto): void {
        this.logger.log('Received daily sales report');
        this.emailService.sendEmail(data);
    }
}

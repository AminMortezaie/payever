# Email Service

A microservice for sending emails in the PayEver architecture.

## Features

- Consume messages from RabbitMQ
- Send email notifications for new invoices
- Send daily sales reports
- Health check endpoints

## Tech Stack

- Node.js
- NestJS framework
- RabbitMQ for messaging
- Jest for testing

## Environment Variables

Copy the sample environment file and adjust as needed:

```bash
cp .env.sample .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| RABBITMQ_URL | RabbitMQ connection URL | amqp://rabbitmq:5672 |
| SMTP_HOST | SMTP server host | smtp.example.com |
| SMTP_PORT | SMTP server port | 587 |
| SMTP_USER | SMTP username | noreply@example.com |
| SMTP_PASSWORD | SMTP password | your_smtp_password |
| EMAIL_FROM | From address for emails | noreply@example.com |
| EMAIL_TO | Default recipient for reports | reports@example.com |
| PORT | Service port | 3002 |
| NODE_ENV | Environment | production |

## API Endpoints

### Health Check
```
GET /health
```

## Message Consumers

The service consumes the following RabbitMQ queues:

- `DAILY_SALES_REPORT` - For daily sales reports

## Running the Service

### With Docker

```bash
# Build and start the service with its dependencies
docker-compose up --build

# Run in detached mode
docker-compose up --build -d
```

### Locally for Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Run in debug mode
npm run start:debug

# Build and run in production mode
npm run build
npm run start:prod
```

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Simulating Email Service

For development and testing, the service logs email content to the console instead of actually sending emails. This behavior can be configured in the email service implementation when needed for production use.

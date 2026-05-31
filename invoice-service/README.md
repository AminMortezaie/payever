# Invoice Service

A microservice for managing invoices in the PayEver architecture.

## Features

- Create, retrieve, and manage invoices
- Store invoice data in MongoDB
- Publish invoice events to RabbitMQ
- Generate daily sales reports
- RESTful API with Swagger documentation

## Tech Stack

- Node.js
- NestJS framework
- MongoDB with Mongoose
- RabbitMQ for messaging
- Jest for testing

## Environment Variables

Copy the sample environment file and adjust as needed:

```bash
cp .env.sample .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb://admin:secretpassword@mongodb:27017/payever?authSource=admin |
| RABBITMQ_URL | RabbitMQ connection URL | amqp://rabbitmq:5672 |
| PORT | Service port | 3001 |
| NODE_ENV | Environment | production |

## API Endpoints

### Health Check
```
GET /api/health
```

### Create Invoice
```
POST /api/invoices
Content-Type: application/json

{
  "customer": "John Doe",
  "amount": 100,
  "reference": "INV-001",
  "date": "2025-04-26T00:00:00.000Z",
  "items": [
    {
      "sku": "ITEM-001",
      "qt": 2
    }
  ]
}
```

### Get All Invoices
```
GET /api/invoices
```

### Get Invoice by ID
```
GET /api/invoices/{id}
```

### Generate Daily Report
```
POST /api/reports/generate
```

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

## Swagger Documentation

When the service is running, access the Swagger UI at:
```
http://localhost:3001/api/docs
```

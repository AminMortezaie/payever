# PayEver Microservices

This project consists of two microservices that work together to process invoices and send email notifications.

## Services Overview

### Invoice Service
- RESTful API for creating and managing invoices
- Stores invoice data in MongoDB
- Publishes messages to RabbitMQ for email notifications
- Generates daily sales reports

### Email Service
- Consumes messages from RabbitMQ
- Sends email notifications for new invoices and daily reports

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- npm or yarn (for local development)

## Environment Setup

1. Clone this repository
2. Copy the sample environment files:
   ```bash
   # Root directory
   cp .env.sample .env
   
   # Invoice service
   cp invoice-service/.env.sample invoice-service/.env
   
   # Email service
   cp email-service/.env.sample email-service/.env
   ```
3. Modify the `.env` files with your specific configuration if needed:
   - Root `.env`: Contains configuration for MongoDB and RabbitMQ services
   - `invoice-service/.env`: Contains configuration specific to the invoice service
   - `email-service/.env`: Contains configuration specific to the email service

## Running with Docker Compose

The entire application uses environment files for configuration. The easiest way to run the entire application stack is using Docker Compose:

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up --build -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f invoice-service
docker-compose logs -f email-service

# Stop services
docker-compose down

# Stop services and remove volumes
docker-compose down -v
```

## Service URLs

- Invoice Service: http://localhost:3001
- Email Service: http://localhost:3002
- MongoDB: localhost:27017
- RabbitMQ: localhost:5672
- RabbitMQ Management UI: http://localhost:15672 (username: guest, password: guest)

## API Endpoints

### Invoice Service

- **Health Check**
  ```
  GET /api/health
  ```

- **Create Invoice**
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

- **Get All Invoices**
  ```
  GET /api/invoices
  ```

- **Get Invoice by ID**
  ```
  GET /api/invoices/{id}
  ```

- **Generate Daily Report**
  ```
  POST /api/reports/generate
  ```

### Email Service

- **Health Check**
  ```
  GET /health
  ```

## Project Structure

```
/
├── .env.sample                 # Sample environment variables for root
├── .gitignore                  # Git ignore rules
├── docker-compose.yml          # Docker Compose configuration
├── mongo-init.js               # MongoDB initialization script
├── package.json                # Root scripts (lint, test, format)
├── invoice-service/
│   ├── .env.sample             # Sample environment variables for invoice service
│   ├── src/
│   ├── test/
│   ├── Dockerfile
│   └── package.json
├── email-service/
│   ├── .env.sample             # Sample environment variables for email service
│   ├── src/
│   ├── test/
│   ├── Dockerfile
│   └── package.json
└── README.md
```

Copy each `.env.sample` to `.env` locally before running. Environment files are excluded from version control.

## Development

To run services locally for development:

1. Install dependencies:
   ```bash
   # Install root dependencies for development tools
   npm install
   
   # Install service dependencies
   cd invoice-service
   npm install
   
   cd ../email-service
   npm install
   ```

2. Start services in development mode:
   ```bash
   # In invoice-service directory
   npm run start:dev
   
   # In email-service directory
   npm run start:dev
   ```

## Code Quality

This project uses ESLint for code quality and Prettier for code formatting. The linting process is integrated into the Docker build process and pre-commit hooks.

### Linting

Run linting on both services:
```bash
# Lint both services
npm run lint

# Lint individual services
npm run lint:invoice
npm run lint:email
```

### Formatting

Format code in both services:
```bash
# Format code in both services
npm run format

# Format individual services
npm run format:invoice
npm run format:email
```

### Pre-commit Hooks

The project uses Husky and lint-staged to run linting before each commit. This ensures that all committed code passes the linting rules.

## Testing

Each service includes unit and integration tests:

```bash
# Run tests for both services
npm test

# Run tests for individual services
npm run test:invoice
npm run test:email

# Run tests with coverage
cd invoice-service
npm run test:cov

cd ../email-service
npm run test:cov
```

## Troubleshooting

- **MongoDB Connection Issues**: Ensure MongoDB is running and credentials are correct in your .env files
- **RabbitMQ Connection Issues**: Check RabbitMQ is running and accessible with the credentials in your .env files
- **Service Health Checks**: Use the health endpoints to verify service status
- **Linting Errors**: Run `npm run lint` to see and fix linting errors

## License

This project is licensed under the MIT License. 

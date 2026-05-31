#!/bin/bash

# Run ESLint in the invoice service
echo "Fixing linting issues in invoice-service..."
cd invoice-service && npm run lint

# Run ESLint in the email service
echo "Fixing linting issues in email-service..."
cd ../email-service && npm run lint

echo "Linting completed!" 
import {
  ValidationPipe,
  ValidationError,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      enableDebugMessages: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Validation failed',
            errors: errors.map((error) => ({
              property: error.property,
              message:
                Object.values(error.constraints || {}).join(', ') ||
                'Validation error',
            })),
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    });
  }
}

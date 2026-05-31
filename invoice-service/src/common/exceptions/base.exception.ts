import { HttpException, HttpStatus } from '@nestjs/common';

export interface ErrorResponse {
  statusCode: number;
  message: string;
  errors?: Array<{ property: string; message: string }>;
}

export class BaseException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus,
    errors?: Array<{ property: string; message: string }>,
  ) {
    const response: ErrorResponse = {
      statusCode: status,
      message,
      ...(errors && { errors }),
    };
    super(response, status);
  }
}

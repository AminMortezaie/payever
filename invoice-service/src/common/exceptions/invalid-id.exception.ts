import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class InvalidIdException extends BaseException {
  constructor(id: string) {
    super('Validation failed', HttpStatus.BAD_REQUEST, [
      {
        property: 'id',
        message: `Invalid ID format: ${id}`,
      },
    ]);
  }
}

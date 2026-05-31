import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class EntityNotFoundException extends BaseException {
  constructor(entity: string, id: string) {
    super('Not Found', HttpStatus.NOT_FOUND, [
      {
        property: 'id',
        message: `${entity} with ID "${id}" not found`,
      },
    ]);
  }
}

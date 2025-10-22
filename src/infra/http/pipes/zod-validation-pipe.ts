import { PipeTransform, ArgumentMetadata, BadRequestException, Logger } from '@nestjs/common';
import { ZodError, ZodSchema  } from 'zod';
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  private readonly logger = new Logger(ZodValidationPipe.name);

  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    this.logger.debug(`Validating ${metadata.type}: ${JSON.stringify(value)}`);
    
    try {
      const parsedValue = this.schema.parse(value);
      this.logger.debug(`Validation successful`);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        this.logger.error(`Validation failed: ${JSON.stringify(error.errors)}`);
        throw new BadRequestException({ errors: fromZodError(error), message: 'Validation failed', statusCode: 400});
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
import { BadRequestException } from '@nestjs/common';

export class CustomValidationException extends BadRequestException {
  constructor(errors: Record<string, any>) {
    const formattedErrors = CustomValidationException.formatErrors(errors);

    super({
      statusCode: 400,
      error: 'Validation 오류',
      message: formattedErrors,
    });
  }

  private static formatErrors(errors: Record<string, any>) {
    const formattedErrors = [];
    for (const field in errors) {
      const constraints = errors[field].constraints;
      if (constraints) {
        const messages = Object.values(constraints).reverse();
        formattedErrors.push({
          field,
          messages,
        });
      }
    }
    return formattedErrors;
  }
}

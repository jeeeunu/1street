import { BadRequestException } from '@nestjs/common';

export class MyCustomValidationException extends BadRequestException {
  constructor(errors: Record<string, any>) {
    const formattedErrors = MyCustomValidationException.formatErrors(errors);

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
        const messages = Object.values(constraints);
        formattedErrors.push({
          field,
          messages,
        });
      }
    }
    return formattedErrors;
  }
}

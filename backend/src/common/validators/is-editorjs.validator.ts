import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

@ValidatorConstraint({ name: 'isEditorJs', async: false })
export class IsEditorJsConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (!value || typeof value !== 'object') {
      return false;
    }

    if (!Array.isArray(value.blocks)) {
      return false;
    }

    if (value.blocks.length > 200) {
      return false;
    }

    for (const block of value.blocks) {
      if (!block || typeof block !== 'object') {
        return false;
      }
      if (typeof block.type !== 'string') {
        return false;
      }
      if (!block.data || typeof block.data !== 'object') {
        return false;
      }
    }

    return true;
  }

  defaultMessage(): string {
    return 'O formato do conteúdo fornecido é inválido. Esperava-se um JSON estruturado do EditorJS com um máximo de 200 blocos.';
  }
}

export function IsEditorJs(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEditorJsConstraint,
    });
  };
}

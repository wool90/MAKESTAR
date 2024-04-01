import { validate } from 'class-validator';
import { sanitize } from 'class-sanitizer';
import { plainToInstance } from 'class-transformer';

enum VALID_TYPE {
    BODY = 'body',
    QUERY = 'query',
    HEADER = 'header',
}

function makeValidator(type: VALID_TYPE) {
    return (inputClass: any) => {
        return (target: object, propertyName: string, descriptor: PropertyDescriptor) => {
            const method = descriptor.value;

            descriptor.value = async function () {
                if (arguments.length > 0) {
                    const instance = plainToInstance(inputClass, arguments[0].request[type]);
                    sanitize(instance);

                    const errors = await validate(instance);
                    if (errors.length > 0) {
                        throw {
                            type: 'validation',
                            message: errors.map((e) => Object.values(e.constraints)).join('\n'),
                        };
                    }

                    arguments[0].request[type] = instance;
                }

                return method.apply(this, arguments);
            };
        };
    };
}

/**
 * method decorator
 * @param inputClass
 */
/* tslint:disable:variable-name */
export const ValidateBody = makeValidator(VALID_TYPE.BODY);

/**
 * method decorator
 * @param inputClass
 */
/* tslint:disable:variable-name */
export const ValidateQuery = makeValidator(VALID_TYPE.QUERY);

/**
 * method decorator
 * @param inputClass
 */
/* tslint:disable:variable-name */
export const ValidateHeader = makeValidator(VALID_TYPE.HEADER);

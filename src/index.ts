import { Kind } from '@sinclair/typebox';
import {
    DefaultErrorFunction,
    type ErrorFunctionParameter,
    SetErrorFunction,
    ValueErrorType,
} from '@sinclair/typebox/errors';

export type MessageKey = keyof typeof ValueErrorType;

export type Messages = Record<MessageKey | 'default', string>;

const MATCH_PARAMS_REGEXP = /\{\w+}/;
const EXTRACT_PARAMS_REGEXP = /\{(\w+)}/;

const MESSAGE_HAS_PARAMS = new Map<string, boolean>();

export const transformMessage = (message: string, error: ErrorFunctionParameter): string => {
    return message.replace(EXTRACT_PARAMS_REGEXP, (substring, key) => {
        if (key === 'Kind') {
            return error.schema[Kind];
        }

        if (key === 'const') {
            return typeof error.schema.const === 'string' ? `'${error.schema.const}'` : `${error.schema.const}`;
        }

        return error.schema[key] || substring;
    });
};

export const setErrorMessages = (messages: Messages, setErrorFunction: typeof SetErrorFunction = SetErrorFunction) => {
    return setErrorFunction((error) => {
        const { errorType } = error;

        const typeKey = ValueErrorType[errorType];

        if (typeKey in messages) {
            const value = messages[typeKey as MessageKey];

            if (value) {
                let hasParams: boolean;

                if (MESSAGE_HAS_PARAMS.has(value)) {
                    hasParams = MESSAGE_HAS_PARAMS.get(value)!;
                } else {
                    hasParams = MATCH_PARAMS_REGEXP.test(value);
                    MESSAGE_HAS_PARAMS.set(value, hasParams);
                }

                if (hasParams) {
                    return transformMessage(value, error);
                }

                return value;
            }

            return transformMessage(value, error);
        }

        return DefaultErrorFunction(error);
    });
};

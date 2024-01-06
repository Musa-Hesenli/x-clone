import * as crypto from 'crypto';
const data = (data: any, statusCode:number = 200) => {
    return {
        data: data,
        statusCode: statusCode
    }
}

const error = (errorMessage: string, statusCode: number = 400) => {
    return {
        error: errorMessage,
        statusCode: statusCode
    }
}

export const responses = {data, error};

const generateRandomBytes = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

export const utils = {generateRandomBytes};
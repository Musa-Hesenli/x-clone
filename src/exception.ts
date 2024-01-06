import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { config } from './config/configuration';


@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Handling validation errors
    if (exception instanceof HttpException && exception.getResponse() && exception.getResponse() instanceof Object) {
      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).send(exception.getResponse());
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = process.env.NODE_ENV == 'development' ? exception.message :'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    return response.status(status).send({
      statusCode: status,
      error: message
    })
  }
}
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WinstonLogger } from '../../utils/logger/logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // Handling different types of exceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse() as string | { message: string };
      const stack = exception.stack;

      // Logging the error
      try {
        const jsonString = JSON.stringify({
          timestamp: new Date().toISOString(),
          statusCode: status,
          message: typeof message === 'string' ? message : message.message,
          stack: stack,
        });
        WinstonLogger.error(jsonString);
      } catch (error) {
        WinstonLogger.error(error);
      }
      // Sending response to the client
      response.status(status).json({
        success: false,
        timestamp: new Date().toISOString(),
        statusCode: status,
        path: request.url,
        message,
      });
    } else {
      // If it's not an HttpException, treat it as internal server error
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = 'Internal server error';

      // Logging the error
      try {
        WinstonLogger.error(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            statusCode: status,
            message,
          }),
        );
      } catch (error) {
        WinstonLogger.error(error);
      }

      // Sending response to the client
      response.status(status).json({
        success: false,
        timestamp: new Date().toISOString(),
        statusCode: status,
        path: request.url,
        message,
      });
    }
  }
}

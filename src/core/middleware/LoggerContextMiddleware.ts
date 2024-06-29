import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
// import { WinstonLogger } from '../../utils/logger/logger'; // logger.ts 파일을 import합니다.

@Injectable()
export class LoggerContextMiddleware implements NestMiddleware {
  constructor(private readonly jwt: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl, headers } = req;
    const userAgent = req.get('user-agent');
    const payload = headers.authorization
      ? this.jwt.decode(headers.authorization)
      : null;
    const userId = payload ? payload.sub : 0;
    const datetime = new Date();
    res.on('finish', () => {
      const { statusCode } = res;
      console.log(
        `${datetime} USER-${userId} METHOD-${method} ORINALURL-${originalUrl} STATUSCODE-${statusCode} IP-${ip} ${userAgent}`,
      );
    });

    next();
  }
}

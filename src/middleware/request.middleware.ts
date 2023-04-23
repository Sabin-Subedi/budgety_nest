import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use(req: Request, res: Response, next: NextFunction) {
    if (res.statusCode > 399) {
      this.logger.error(
        `Logging HTTP request ${req.method} ${req.baseUrl} ${res.statusCode}`,
      );
    } else {
      this.logger.log(
        `Logging HTTP request ${req.method} ${req.baseUrl} ${res.statusCode}`,
      );
    }
    next();
  }
}

import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  const logger = new Logger(`HTTP`);

  if (res.statusCode > 399) {
    logger.error(
      `Logging HTTP request ${req.method} ${req.baseUrl} ${res.statusCode}`,
    );
  } else {
    logger.log(
      `Logging HTTP request ${req.method} ${req.url} ${res.statusCode}`,
    );
  }
  next();
}

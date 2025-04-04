import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
 use(req: Request, res: Response, next: NextFunction) {
  /*  
  console.log('--- Cabeceras de la petición ---');
    console.log(req.headers);
    if (!req.headers.authorization) {
      console.log('Authorization:', req.headers.authorization);
    }
    console.log('-------------------------------');
    */
    next();
  }
}

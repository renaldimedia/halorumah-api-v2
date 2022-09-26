import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PropertyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // console.log({request: {...req}});
    console.log({response: {...res}});
    next();
  }
}

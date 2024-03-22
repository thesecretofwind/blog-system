import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AppService {
  getHello(res: Response) {
    return res.json({
      code: 1,
      name: 'Hello World!',
    });
  }
}

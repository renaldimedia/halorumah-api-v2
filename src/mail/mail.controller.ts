import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(
        private readonly serv:MailService,
      ) {}
    
      @Get('test')
      async uploadFile() {
        return this.serv.testMail();
      }
    
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ThrottlerProxyGuard } from './global-guards/throttle-proxy.guard';

@Controller()
// @UseGuards(ThrottlerProxyGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

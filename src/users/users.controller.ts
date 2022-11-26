import {
  Controller,
  Get,
  Param
} from '@nestjs/common';
import { UsersService } from './users.service';

// just a typical nestJs controller
@Controller('/api/user')
export class UserController {
  constructor(private readonly usersService: UsersService) { }

  // @UseInterceptors(FileInterceptor('file'))
  @Get('activate-package/:user/:packageid/:statuspayment')
  async confirmPackage(@Param('packageid') packageId: number, @Param('user') userId: string, @Param('statuspayment') statusPayment: number) {
    return this.usersService.activatePackage(packageId, statusPayment);
  }
}

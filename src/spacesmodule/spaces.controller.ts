import {
    Controller,
    UploadedFile,
    UseInterceptors,
    Post,
    UseGuards
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { DoSpaces } from './spacesservice/dospaces.service';
  import { UploadedMulterFileI } from './spacesservice';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
  
  // just a typical nestJs controller
  @Controller('/api/upload')
  @UseGuards(JwtAuthGuard)
  export class SpacesController {
    constructor(
      private readonly doSpacesService: DoSpaces,
    ) {}
  
    @UseInterceptors(FileInterceptor('file'))
    @Post('spaces')
    async uploadFile(@UploadedFile() file: UploadedMulterFileI, @CurrentUser() user: any) {
      if(file === null || typeof file === 'undefined'){
        console.log('file tidak ada!');
        return {message: 'Please select File!'}
      }
      const url = await this.doSpacesService.uploadFile(file, user.userId, "");
  
      return url
    }
  }
  
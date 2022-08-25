import { Module } from '@nestjs/common';
import { SpacesController } from './spaces.controller';
import { DoSpaces } from './spacesservice/dospaces.service';
import { DoSpacesServicerovider } from './spacesservice';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [SpacesController],
  // provide both the service and the custom provider
  providers: [DoSpacesServicerovider, DoSpaces],
  exports: [DoSpaces]
})
export class SpacesModule {}
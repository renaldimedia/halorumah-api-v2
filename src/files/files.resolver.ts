import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FilesService } from './files.service';
import { File } from './entities/file.entity';
import { CreateFileInput } from './dto/create-file.input';
import { UpdateFileInput } from './dto/update-file.input';

@Resolver(() => File)
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Mutation(() => File)
  createFile(@Args('createFileInput') createFileInput: CreateFileInput) {
    return this.filesService.create(createFileInput);
  }

  @Query(() => [File], { name: 'files' })
  findAll(@Args('userid', {type :() => String, nullable: true}) userid: string = null) {
    return this.filesService.findAll(userid);
  }

  @Query(() => File, { name: 'file' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.filesService.findOne(id);
  }

  // @Mutation(() => File)
  // updateFile(@Args('updateFileInput') updateFileInput: UpdateFileInput) {
  //   return this.filesService.update(updateFileInput.id, updateFileInput);
  // }

  // @Mutation(() => File)
  // removeFile(@Args('id', { type: () => String }) id: string) {
  //   return this.filesService.remove(id);
  // }
}

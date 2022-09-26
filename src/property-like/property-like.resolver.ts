import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PropertyLikeService } from './property-like.service';
import { PropertyLike } from './entities/property-like.entity';
import { CreatePropertyLikeInput } from './dto/create-property-like.input';
import { UpdatePropertyLikeInput } from './dto/update-property-like.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';

@Resolver(() => PropertyLike)
export class PropertyLikeResolver {
  constructor(private readonly propertyLikeService: PropertyLikeService) {}

  @Mutation(() => PropertyLike)
  @UseGuards(JwtAuthGuard)
  createPropertyLike(@Args('createPropertyLikeInput') createPropertyLikeInput: CreatePropertyLikeInput, @CurrentUser() user:any) {
    return this.propertyLikeService.create(createPropertyLikeInput, user.id);
  }

  @Query(() => [PropertyLike], { name: 'propertyLike' })
  findAll() {
    return this.propertyLikeService.findAll();
  }

  @Query(() => PropertyLike, { name: 'propertyLike' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.propertyLikeService.findOne(id);
  }

  @Mutation(() => PropertyLike)
  updatePropertyLike(@Args('updatePropertyLikeInput') updatePropertyLikeInput: UpdatePropertyLikeInput) {
    return this.propertyLikeService.update(updatePropertyLikeInput.id, updatePropertyLikeInput);
  }

  @Mutation(() => PropertyLike)
  removePropertyLike(@Args('id', { type: () => Int }) id: number) {
    return this.propertyLikeService.remove(id);
  }
}

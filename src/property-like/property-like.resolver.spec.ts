import { Test, TestingModule } from '@nestjs/testing';
import { PropertyLikeResolver } from './property-like.resolver';
import { PropertyLikeService } from './property-like.service';

describe('PropertyLikeResolver', () => {
  let resolver: PropertyLikeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyLikeResolver, PropertyLikeService],
    }).compile();

    resolver = module.get<PropertyLikeResolver>(PropertyLikeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

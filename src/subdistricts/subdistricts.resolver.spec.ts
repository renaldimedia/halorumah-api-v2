import { Test, TestingModule } from '@nestjs/testing';
import { SubdistrictsResolver } from './subdistricts.resolver';
import { SubdistrictsService } from './subdistricts.service';

describe('SubdistrictsResolver', () => {
  let resolver: SubdistrictsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubdistrictsResolver, SubdistrictsService],
    }).compile();

    resolver = module.get<SubdistrictsResolver>(SubdistrictsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

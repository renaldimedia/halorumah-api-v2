import { Test, TestingModule } from '@nestjs/testing';
import { ProvincesResolver } from './provinces.resolver';
import { ProvincesService } from './provinces.service';

describe('ProvincesResolver', () => {
  let resolver: ProvincesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProvincesResolver, ProvincesService],
    }).compile();

    resolver = module.get<ProvincesResolver>(ProvincesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

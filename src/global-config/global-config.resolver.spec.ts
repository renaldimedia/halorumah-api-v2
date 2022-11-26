import { Test, TestingModule } from '@nestjs/testing';
import { GlobalConfigResolver } from './global-config.resolver';
import { GlobalConfigService } from './global-config.service';

describe('GlobalConfigResolver', () => {
  let resolver: GlobalConfigResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalConfigResolver, GlobalConfigService],
    }).compile();

    resolver = module.get<GlobalConfigResolver>(GlobalConfigResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

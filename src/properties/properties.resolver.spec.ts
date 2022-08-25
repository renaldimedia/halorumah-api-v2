import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesResolver } from './properties.resolver';
import { PropertiesService } from './properties.service';

describe('PropertiesResolver', () => {
  let resolver: PropertiesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertiesResolver, PropertiesService],
    }).compile();

    resolver = module.get<PropertiesResolver>(PropertiesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

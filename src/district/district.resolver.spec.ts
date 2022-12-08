import { Test, TestingModule } from '@nestjs/testing';
import { DistrictResolver } from './district.resolver';
import { DistrictService } from './district.service';

describe('DistrictResolver', () => {
  let resolver: DistrictResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DistrictResolver, DistrictService],
    }).compile();

    resolver = module.get<DistrictResolver>(DistrictResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

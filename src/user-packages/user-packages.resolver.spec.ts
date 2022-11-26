import { Test, TestingModule } from '@nestjs/testing';
import { UserPackagesResolver } from './user-packages.resolver';
import { UserPackagesService } from './user-packages.service';

describe('UserPackagesResolver', () => {
  let resolver: UserPackagesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPackagesResolver, UserPackagesService],
    }).compile();

    resolver = module.get<UserPackagesResolver>(UserPackagesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

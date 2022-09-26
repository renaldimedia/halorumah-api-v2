import { Test, TestingModule } from '@nestjs/testing';
import { PropertyLikeService } from './property-like.service';

describe('PropertyLikeService', () => {
  let service: PropertyLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyLikeService],
    }).compile();

    service = module.get<PropertyLikeService>(PropertyLikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyDuesService } from './monthly-dues.service';

describe('MonthlyDuesService', () => {
  let service: MonthlyDuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonthlyDuesService],
    }).compile();

    service = module.get<MonthlyDuesService>(MonthlyDuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsReportsService } from './incidents-reports.service';

describe('IncidentsReportsService', () => {
  let service: IncidentsReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidentsReportsService],
    }).compile();

    service = module.get<IncidentsReportsService>(IncidentsReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

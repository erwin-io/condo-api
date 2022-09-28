import { Test, TestingModule } from '@nestjs/testing';
import { GuestMonitoringService } from './guest-monitoring.service';

describe('GuestMonitoringService', () => {
  let service: GuestMonitoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuestMonitoringService],
    }).compile();

    service = module.get<GuestMonitoringService>(GuestMonitoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

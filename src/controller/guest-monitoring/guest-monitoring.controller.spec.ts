import { Test, TestingModule } from '@nestjs/testing';
import { GuestMonitoringController } from './guest-monitoring.controller';

describe('GuestMonitoringController', () => {
  let controller: GuestMonitoringController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuestMonitoringController],
    }).compile();

    controller = module.get<GuestMonitoringController>(GuestMonitoringController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

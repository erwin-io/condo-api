import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsReportsController } from './incidents-reports.controller';

describe('IncidentsReportsController', () => {
  let controller: IncidentsReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentsReportsController],
    }).compile();

    controller = module.get<IncidentsReportsController>(IncidentsReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

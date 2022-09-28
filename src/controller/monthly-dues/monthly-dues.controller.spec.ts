import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyDuesController } from './monthly-dues.controller';

describe('MonthlyDuesController', () => {
  let controller: MonthlyDuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonthlyDuesController],
    }).compile();

    controller = module.get<MonthlyDuesController>(MonthlyDuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

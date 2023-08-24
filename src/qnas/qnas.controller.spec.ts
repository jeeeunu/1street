import { Test, TestingModule } from '@nestjs/testing';
import { QnasController } from './qnas.controller';

describe('QnasController', () => {
  let controller: QnasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QnasController],
    }).compile();

    controller = module.get<QnasController>(QnasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

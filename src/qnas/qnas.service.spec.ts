import { Test, TestingModule } from '@nestjs/testing';
import { QnaService } from './qnas.service';

describe('QnasService', () => {
  let service: QnasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QnaService],
    }).compile();

    service = module.get<QnaService>(QnaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

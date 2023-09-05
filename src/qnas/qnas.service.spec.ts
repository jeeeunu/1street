import { Test, TestingModule } from '@nestjs/testing';
import { QnasService } from './qnas.service';

describe('QnasService', () => {
  let service: QnasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QnasService],
    }).compile();

    service = module.get<QnasService>(QnasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

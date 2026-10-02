import { Test, TestingModule } from '@nestjs/testing';
import { TypeChambreService } from './type-chambre.service.js';

describe('TypeChambreService', () => {
  let service: TypeChambreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeChambreService],
    }).compile();

    service = module.get<TypeChambreService>(TypeChambreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

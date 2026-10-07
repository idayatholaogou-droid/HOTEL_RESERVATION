import { Test, TestingModule } from '@nestjs/testing';
import { PaiementController } from './paiement.controller.js';
import { PaiementService } from './paiement.service.js';

describe('PaiementController', () => {
  let controller: PaiementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaiementController],
      providers: [PaiementService],
    }).compile();

    controller = module.get<PaiementController>(PaiementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

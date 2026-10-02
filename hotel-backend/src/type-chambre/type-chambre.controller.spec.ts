import { Test, TestingModule } from '@nestjs/testing';
import { TypeChambreController } from './type-chambre.controller.js';
import { TypeChambreService } from './type-chambre.service.js';

describe('TypeChambreController', () => {
  let controller: TypeChambreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeChambreController],
      providers: [TypeChambreService],
    }).compile();

    controller = module.get<TypeChambreController>(TypeChambreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

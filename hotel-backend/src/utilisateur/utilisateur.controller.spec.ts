import { Test, TestingModule } from '@nestjs/testing';
import { UtilisateurController } from './utilisateur.controller.js';
import { UtilisateurService } from './utilisateur.service.js';

describe('UtilisateurController', () => {
  let controller: UtilisateurController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtilisateurController],
      providers: [UtilisateurService],
    }).compile();

    controller = module.get<UtilisateurController>(UtilisateurController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilisateurService } from './utilisateur.service.js';
import { UtilisateurController } from './utilisateur.controller.js';
import { Utilisateur } from './entities/utilisateur.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Utilisateur])],
  controllers: [UtilisateurController],
  providers: [UtilisateurService],
})
export class UtilisateurModule {}
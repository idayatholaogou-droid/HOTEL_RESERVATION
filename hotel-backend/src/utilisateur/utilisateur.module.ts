import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilisateurService } from './utilisateur.service.js';
import { UtilisateurController } from './utilisateur.controller.js';
import { Utilisateur } from './entities/utilisateur.entity.js';
import { Client } from '../client/entities/client.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Utilisateur, Client]),
    AuthModule,   //  Donne accès à AuthService
  ],
  controllers: [UtilisateurController],
  providers: [UtilisateurService],
})
export class UtilisateurModule {}
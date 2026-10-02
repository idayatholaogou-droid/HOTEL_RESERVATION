import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto.js';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto.js';
import { Utilisateur } from './entities/utilisateur.entity.js';

@Injectable()
export class UtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly utilisateurRepository: Repository<Utilisateur>,
  ) {}

  private sansMotDePasse(utilisateur: Utilisateur | null) {
    if (!utilisateur) {
      return null;
    }
    const { mot_de_passe, ...reste } = utilisateur;
    return reste;
  }

  async create(dto: CreateUtilisateurDto) {
    const mot_de_passe = await bcrypt.hash(dto.mot_de_passe, 10);
    const utilisateur = this.utilisateurRepository.create({
      ...dto,
      mot_de_passe,
    });
    const enregistre = await this.utilisateurRepository.save(utilisateur);
    return this.sansMotDePasse(enregistre);
  }

  async findAll() {
    const utilisateurs = await this.utilisateurRepository.find();
    return utilisateurs.map((u) => this.sansMotDePasse(u));
  }

  async findOne(id: number) {
    const utilisateur = await this.utilisateurRepository.findOneBy({
      id_utilisateur: id,
    });
    return this.sansMotDePasse(utilisateur);
  }

  async update(id: number, dto: UpdateUtilisateurDto) {
    const donnees = { ...dto };
    if (donnees.mot_de_passe) {
      donnees.mot_de_passe = await bcrypt.hash(donnees.mot_de_passe, 10);
    }
    await this.utilisateurRepository.update(id, donnees);
    return this.findOne(id);
  }

    async login(login: string, mot_de_passe: string) {
    const utilisateur = await this.utilisateurRepository.findOneBy({ login });
    const valide =
      utilisateur && (await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe));
    if (!valide) {
      throw new UnauthorizedException('Login ou mot de passe incorrect');
    }
    return this.sansMotDePasse(utilisateur);
  }

  async remove(id: number) {
    await this.utilisateurRepository.delete(id);
    return { deleted: true };
  }
}
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto.js';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto.js';
import { Utilisateur } from './entities/utilisateur.entity.js';
import { Client } from '../client/entities/client.entity.js';
import { AuthService } from '../auth/auth.service.js';

@Injectable()
export class UtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly utilisateurRepository: Repository<Utilisateur>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly authService: AuthService,
  ) {}

  private sansMotDePasse(utilisateur: Utilisateur | null) {
    if (!utilisateur) {
      return null;
    }
    const { mot_de_passe, ...reste } = utilisateur;
    return reste;
  }

    async create(dto: CreateUtilisateurDto) {
    // Vérifie que le login n'existe pas
    const existant = await this.utilisateurRepository.findOneBy({
      login: dto.login,
    });
    if (existant) {
      throw new ConflictException('Ce login est déjà utilisé');
    }

    // Vérifie le rôle
    const rolesValides = ['client', 'receptionniste', 'admin'];
    if (!rolesValides.includes(dto.role)) {
      throw new BadRequestException(
        `Rôle invalide. Valeurs autorisées : ${rolesValides.join(', ')}`,
      );
    }

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
    if (
      !utilisateur ||
      !(await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe))
    ) {
      throw new UnauthorizedException('Login ou mot de passe incorrect');
    }

    // Récupère le client lié si c'est un client
    let id_client: number | null = null;
    if (utilisateur.role === 'client') {
      const client = await this.clientRepository.findOne({
        where: {
          utilisateur: { id_utilisateur: utilisateur.id_utilisateur },
        },
      });
      id_client = client?.id_client ?? null;
    }

    // Génère le token avec id_client
    const token = await this.authService.genererToken({
      id_utilisateur: utilisateur.id_utilisateur,
      login: utilisateur.login,
      role: utilisateur.role,
      id_client,
    });

    const resultat = this.sansMotDePasse(utilisateur);

    return {
      ...resultat,
      id_client,
      access_token: token,
    };
  }

  async remove(id: number) {
    await this.utilisateurRepository.delete(id);
    return { deleted: true };
  }
}
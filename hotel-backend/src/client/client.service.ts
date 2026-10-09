import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto.js';
import { InscriptionDto } from './dto/inscription.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { Client } from './entities/client.entity.js';
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity.js';
import { AlerteService } from '../alerte/alerte.service.js';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly alerteService: AlerteService,
  ) {}

  async inscrire(dto: InscriptionDto) {
    if (!dto.email || !dto.adresse) {
      throw new BadRequestException("L'email et l'adresse sont obligatoires");
    }
    const email = dto.email.trim().toLowerCase();

    // 🚨 DÉTECTION : tentative de forcer un rôle privilégié
    const dtoBrut = dto as any;
    if (
      dtoBrut.role === 'admin' ||
      dtoBrut.role === 'receptionniste' ||
      dtoBrut.role === 'réceptionniste'
    ) {
      // 🔔 Crée une alerte pour l'admin
      await this.alerteService.creer(
        'tentative_role_privilégié',
        `Tentative d'inscription avec le rôle "${dtoBrut.role}" depuis l'email "${email}". Le rôle a été forcé à "client".`,
        email,
      );
    }

    const existant = await this.clientRepository.manager.findOneBy(
      Utilisateur,
      { login: email },
    );
    if (existant) {
      throw new ConflictException('Cet email est déjà utilisé');
    }
    const mot_de_passe = await bcrypt.hash(dto.mot_de_passe, 10);

    return this.clientRepository.manager.transaction(async (manager) => {
      const utilisateur = await manager.save(
        manager.create(Utilisateur, {
          nom: dto.nom,
          prenom: dto.prenom,
          login: email,
          mot_de_passe,
          role: 'client', // ⚠️ TOUJOURS forcé à 'client'
        }),
      );
      const client = await manager.save(
        manager.create(Client, {
          nom: dto.nom,
          prenom: dto.prenom,
          telephone: dto.telephone,
          email,
          adresse: dto.adresse,
          utilisateur,
        }),
      );
      return {
        id_client: client.id_client,
        nom: client.nom,
        prenom: client.prenom,
        telephone: client.telephone,
        email: client.email,
        adresse: client.adresse,
        utilisateur: {
          id_utilisateur: utilisateur.id_utilisateur,
          login: utilisateur.login,
          role: utilisateur.role,
        },
      };
    });
  }

  create(dto: CreateClientDto) {
    const client = this.clientRepository.create(dto);
    return this.clientRepository.save(client);
  }

  findAll() {
    return this.clientRepository.find();
  }

  findOne(id: number) {
    return this.clientRepository.findOneBy({ id_client: id });
  }

  async update(id: number, dto: UpdateClientDto) {
    await this.clientRepository.update(id, dto);
    return this.findOne(id);
  }

  async statistiques() {
    const tous = await this.clientRepository.find({
      relations: { utilisateur: true },
      order: { id_client: 'DESC' },
    });

    const total = tous.length;

    const debutMois = new Date();
    debutMois.setDate(1);
    debutMois.setHours(0, 0, 0, 0);

    const nouveauxCeMois = tous.filter(
      (c) => c.utilisateur && new Date(c.utilisateur.id_utilisateur) >= debutMois,
    ).length;

    const avecCompte = tous.filter((c) => c.utilisateur).length;
    const sansCompte = total - avecCompte;

    return {
      total,
      nouveauxCeMois,
      avecCompte,
      sansCompte,
    };
  }

  async remove(id: number) {
    await this.clientRepository.delete(id);
    return { deleted: true };
  }
}
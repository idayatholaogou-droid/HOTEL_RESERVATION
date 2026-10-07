import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto.js';
import { InscriptionDto } from './dto/inscription.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { Client } from './entities/client.entity.js';
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity.js';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async inscrire(dto: InscriptionDto) {
    const existant = await this.clientRepository.manager.findOneBy(
      Utilisateur,
      { login: dto.login },
    );
    if (existant) {
      throw new ConflictException('Ce login est déjà utilisé');
    }
    const mot_de_passe = await bcrypt.hash(dto.mot_de_passe, 10);

    return this.clientRepository.manager.transaction(async (manager) => {
      const utilisateur = await manager.save(
        manager.create(Utilisateur, {
          nom: dto.nom,
          prenom: dto.prenom,
          login: dto.login,
          mot_de_passe,
          role: 'client',
        }),
      );
      const client = await manager.save(
        manager.create(Client, {
          nom: dto.nom,
          prenom: dto.prenom,
          telephone: dto.telephone,
          email: dto.email,
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

  async remove(id: number) {
    await this.clientRepository.delete(id);
    return { deleted: true };
  }
}
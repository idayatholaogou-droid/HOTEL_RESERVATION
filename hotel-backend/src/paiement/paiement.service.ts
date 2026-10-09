import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaiementDto } from './dto/create-paiement.dto.js';
import { Paiement } from './entities/paiement.entity.js';
import { Reservation } from '../reservation/entities/reservation.entity.js';

interface UtilisateurConnecte {
  id_utilisateur: number;
  login: string;
  role: string;
  id_client: number | null;
}

@Injectable()
export class PaiementService {
  constructor(
    @InjectRepository(Paiement)
    private readonly paiementRepository: Repository<Paiement>,
  ) {}

  async create(dto: CreatePaiementDto, utilisateur: UtilisateurConnecte) {
    if (!dto.mode) {
      throw new BadRequestException('Le mode de paiement est obligatoire');
    }

    return this.paiementRepository.manager.transaction(async (manager) => {
      const reservation = await manager.findOne(Reservation, {
        where: { id_reservation: dto.id_reservation },
        relations: { client: true, chambre: { type: true } },
      });

      if (!reservation) {
        throw new NotFoundException('Réservation introuvable');
      }

      // 🔒 Un client ne peut payer que SA réservation
      if (utilisateur.role === 'client') {
        if (utilisateur.id_client === null) {
          throw new ForbiddenException('Client non identifié');
        }
        if (reservation.client.id_client !== utilisateur.id_client) {
          throw new ForbiddenException(
            "Vous ne pouvez pas payer la réservation d'un autre client",
          );
        }
      }

      if (reservation.statut === 'annulee') {
        throw new BadRequestException('Cette réservation est annulée');
      }
      if (reservation.statut === 'confirmee') {
        throw new ConflictException('Cette réservation est déjà payée');
      }

      const nuits = Math.round(
        (new Date(reservation.date_depart).getTime() -
          new Date(reservation.date_arrivee).getTime()) /
          86400000,
      );
      const montant = nuits * Number(reservation.chambre.type.prix_nuit);

      const paiement = await manager.save(
        manager.create(Paiement, { montant, mode: dto.mode, reservation }),
      );
      reservation.statut = 'confirmee';
      await manager.save(reservation);
      return paiement;
    });
  }

  findAll() {
    return this.paiementRepository.find();
  }

  findOne(id: number) {
    return this.paiementRepository.findOneBy({ id_paiement: id });
  }
}
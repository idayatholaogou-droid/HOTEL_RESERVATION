import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaiementDto } from './dto/create-paiement.dto.js';
import { Paiement } from './entities/paiement.entity.js';
import { Reservation } from '../reservation/entities/reservation.entity.js';

@Injectable()
export class PaiementService {
  constructor(
    @InjectRepository(Paiement)
    private readonly paiementRepository: Repository<Paiement>,
  ) {}

  async create(dto: CreatePaiementDto) {
    if (!dto.mode) {
      throw new BadRequestException('Le mode de paiement est obligatoire');
    }
    return this.paiementRepository.manager.transaction(async (manager) => {
      const reservation = await manager.findOneBy(Reservation, {
        id_reservation: dto.id_reservation,
      });
      if (!reservation) {
        throw new NotFoundException('Réservation introuvable');
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
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { UpdateReservationDto } from './dto/update-reservation.dto.js';
import { Reservation } from './entities/reservation.entity.js';
import { Client } from '../client/entities/client.entity.js';
import { Chambre } from '../chambre/entities/chambre.entity.js';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  private verifierDates(arrivee: string, depart: string) {
    if (!(arrivee < depart)) {
      throw new BadRequestException(
        "La date d'arrivée doit être avant la date de départ",
      );
    }
  }

  private async verifierDisponibilite(
    id_chambre: number,
    arrivee: string,
    depart: string,
    exclureId?: number,
  ) {
    const conflit = await this.reservationRepository.findOne({
      where: {
        chambre: { id_chambre },
        statut: Not('annulee'),
        date_arrivee: LessThan(depart),
        date_depart: MoreThan(arrivee),
        ...(exclureId !== undefined && { id_reservation: Not(exclureId) }),
      },
    });
    if (conflit) {
      throw new ConflictException(
        'Cette chambre est déjà réservée sur cette période',
      );
    }
  }

  async create(dto: CreateReservationDto) {
    this.verifierDates(dto.date_arrivee, dto.date_depart);
    await this.verifierDisponibilite(
      dto.id_chambre,
      dto.date_arrivee,
      dto.date_depart,
    );
    const reservation = this.reservationRepository.create({
      date_arrivee: dto.date_arrivee,
      date_depart: dto.date_depart,
      client: { id_client: dto.id_client },
      chambre: { id_chambre: dto.id_chambre },
    });
    const enregistree = await this.reservationRepository.save(reservation);
    return this.findOne(enregistree.id_reservation);
  }

  findAll() {
    return this.reservationRepository.find();
  }

  findOne(id: number) {
    return this.reservationRepository.findOneBy({ id_reservation: id });
  }

  async update(id: number, dto: UpdateReservationDto) {
    const reservation = await this.findOne(id);
    if (!reservation) {
      throw new NotFoundException('Réservation introuvable');
    }
    const { id_client, id_chambre, ...data } = dto;
    Object.assign(reservation, data);
    if (id_client !== undefined) {
      reservation.client = { id_client } as Client;
    }
    if (id_chambre !== undefined) {
      reservation.chambre = { id_chambre } as Chambre;
    }
    this.verifierDates(reservation.date_arrivee, reservation.date_depart);
    if (reservation.statut !== 'annulee') {
      await this.verifierDisponibilite(
        reservation.chambre.id_chambre,
        reservation.date_arrivee,
        reservation.date_depart,
        id,
      );
    }
    await this.reservationRepository.save(reservation);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.reservationRepository.delete(id);
    return { deleted: true };
  }
}
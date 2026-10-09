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

    /**
   * Récupère toutes les réservations d'un client
   */
  async findByClient(id_client: number) {
    return this.reservationRepository.find({
      where: { client: { id_client } },
      order: { date_arrivee: 'DESC' },
    });
  }

  async annuler(id: number) {
    const reservation = await this.findOne(id);
    if (!reservation) {
      throw new NotFoundException('Réservation introuvable');
    }
    if (reservation.statut === 'annulee') {
      throw new BadRequestException('Cette réservation est déjà annulée');
    }
    reservation.statut = 'annulee';
    await this.reservationRepository.save(reservation);
    return this.findOne(id);
  }

    /**
   * Ajoute un avis (note + commentaire) à une réservation terminée
   */
  async ajouterAvis(
    id: number,
    id_client: number,
    note: number,
    commentaire: string,
  ) {
    const reservation = await this.findOne(id);
    if (!reservation) {
      throw new NotFoundException('Réservation introuvable');
    }

    // Vérifie que la réservation appartient bien au client
    if (reservation.client?.id_client !== id_client) {
      throw new BadRequestException(
        'Vous ne pouvez pas noter cette réservation',
      );
    }

    // On ne peut noter qu'une réservation terminée
    if (reservation.statut !== 'terminee') {
      throw new BadRequestException(
        'Vous ne pouvez noter qu\'une réservation terminée',
      );
    }

    // Un avis existe-t-il déjà ?
    if (reservation.note !== null && reservation.note !== undefined) {
      throw new BadRequestException('Vous avez déjà laissé un avis');
    }

    // Note entre 1 et 5
    if (note < 1 || note > 5) {
      throw new BadRequestException('La note doit être entre 1 et 5');
    }

    reservation.note = note;
    reservation.commentaire = commentaire;
    await this.reservationRepository.save(reservation);
    return this.findOne(id);
  }

  /**
   * Récupère tous les avis d'une chambre
   */
    async avisParChambre(id_chambre: number) {
    const tous = await this.reservationRepository.find({
      where: {
        chambre: { id_chambre },
      },
      relations: { client: true },
      order: { id_reservation: 'DESC' },
    });

    // Filtre ceux qui ont une note
    const avis = tous.filter((r) => r.note !== null && r.note !== undefined);

    const total = avis.length;
    const moyenne =
      total > 0
        ? avis.reduce((s, r) => s + (r.note ?? 0), 0) / total
        : 0;

    return {
      moyenne: Number(moyenne.toFixed(1)),
      total,
      avis: avis.map((r) => ({
        id_reservation: r.id_reservation,
        note: r.note,
        commentaire: r.commentaire,
        client: r.client
          ? { nom: r.client.nom, prenom: r.client.prenom }
          : null,
      })),
    };
  }
    /**
   * Check-in : la réservation passe de "confirmee" à "en_cours"
   */
  async checkIn(id: number) {
    const reservation = await this.findOne(id);
    if (!reservation) {
      throw new NotFoundException('Réservation introuvable');
    }
    if (reservation.statut !== 'confirmee') {
      throw new BadRequestException(
        'Seule une réservation confirmée peut être check-in',
      );
    }
    reservation.statut = 'en_cours';
    await this.reservationRepository.save(reservation);
    return this.findOne(id);
  }

  /**
   * Check-out : la réservation passe de "en_cours" à "terminee"
   */
  async checkOut(id: number) {
    const reservation = await this.findOne(id);
    if (!reservation) {
      throw new NotFoundException('Réservation introuvable');
    }
    if (reservation.statut !== 'en_cours') {
      throw new BadRequestException(
        'Seule une réservation en cours peut être check-out',
      );
    }
    reservation.statut = 'terminee';
    await this.reservationRepository.save(reservation);
    return this.findOne(id);
  }

    /**
   * Réservations du jour : arrivées et départs prévus
   */
  async reservationsDuJour() {
    const aujourdhui = new Date().toISOString().slice(0, 10);

    const arrivees = await this.reservationRepository.find({
      where: {
        date_arrivee: aujourdhui,
        statut: Not('annulee'),
      },
      relations: { client: true, chambre: { type: true } },
      order: { id_reservation: 'ASC' },
    });

    const departs = await this.reservationRepository.find({
      where: {
        date_depart: aujourdhui,
        statut: Not('annulee'),
      },
      relations: { client: true, chambre: { type: true } },
      order: { id_reservation: 'ASC' },
    });

    return { date: aujourdhui, arrivees, departs };
  }

  /**
   * Toutes les réservations avec relations complètes
   */
  async findAllComplet() {
    return this.reservationRepository.find({
      relations: { client: true, chambre: { type: true } },
      order: { date_arrivee: 'DESC' },
    });
  }

  async remove(id: number) {
    await this.reservationRepository.delete(id);
    return { deleted: true };
  }
}
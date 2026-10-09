import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chambre } from '../chambre/entities/chambre.entity.js';
import { Client } from '../client/entities/client.entity.js';
import { Reservation } from '../reservation/entities/reservation.entity.js';
import { Paiement } from '../paiement/entities/paiement.entity.js';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Chambre)
    private readonly chambreRepository: Repository<Chambre>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Paiement)
    private readonly paiementRepository: Repository<Paiement>,
  ) {}

  async statistiques() {
    const totalChambres = await this.chambreRepository.count();
    const totalClients = await this.clientRepository.count();
    const totalReservations = await this.reservationRepository.count();

    const enAttente = await this.reservationRepository.count({
      where: { statut: 'en_attente' },
    });
    const confirmees = await this.reservationRepository.count({
      where: { statut: 'confirmee' },
    });
    const enCours = await this.reservationRepository.count({
      where: { statut: 'en_cours' },
    });
    const terminees = await this.reservationRepository.count({
      where: { statut: 'terminee' },
    });
    const annulees = await this.reservationRepository.count({
      where: { statut: 'annulee' },
    });

    const debutMois = new Date();
    debutMois.setDate(1);
    debutMois.setHours(0, 0, 0, 0);

    const paiements = await this.paiementRepository.find();
    const paiementsMois = paiements.filter(
      (p) => new Date(p.date_paiement) >= debutMois,
    );
    const revenusMois = paiementsMois.reduce(
      (s, p) => s + Number(p.montant),
      0,
    );
    const revenusTotal = paiements.reduce((s, p) => s + Number(p.montant), 0);

    const chambresDisponibles = await this.chambreRepository.count({
      where: { statut: 'disponible' },
    });
    const chambresOccupees = await this.chambreRepository.count({
      where: { statut: 'occupee' },
    });

    const dernieresReservations = await this.reservationRepository.find({
      relations: { client: true, chambre: true },
      order: { id_reservation: 'DESC' },
      take: 5,
    });

    return {
      chambres: {
        total: totalChambres,
        disponibles: chambresDisponibles,
        occupees: chambresOccupees,
      },
      clients: {
        total: totalClients,
      },
      reservations: {
        total: totalReservations,
        enAttente,
        confirmees,
        enCours,
        terminees,
        annulees,
      },
      revenus: {
        mois: Number(revenusMois.toFixed(2)),
        total: Number(revenusTotal.toFixed(2)),
      },
      dernieresReservations: dernieresReservations.map((r) => ({
        id_reservation: r.id_reservation,
        client: r.client
          ? `${r.client.prenom} ${r.client.nom}`
          : 'Client supprimé',
        chambre: r.chambre?.numero ?? '—',
        date_arrivee: r.date_arrivee,
        date_depart: r.date_depart,
        statut: r.statut,
      })),
    };
  }
}
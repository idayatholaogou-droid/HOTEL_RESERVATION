import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChambreDto } from './dto/create-chambre.dto.js';
import { UpdateChambreDto } from './dto/update-chambre.dto.js';
import { Chambre } from './entities/chambre.entity.js';
import { TypeChambre } from '../type-chambre/entities/type-chambre.entity.js';
import { Reservation } from '../reservation/entities/reservation.entity.js';

@Injectable()
export class ChambreService {
  constructor(
    @InjectRepository(Chambre)
    private readonly chambreRepository: Repository<Chambre>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  create(dto: CreateChambreDto) {
    const { id_type, ...data } = dto;
    const chambre = this.chambreRepository.create({
      ...data,
      type: { id_type },
    });
    return this.chambreRepository.save(chambre);
  }

  // ✅ findAll avec statut CALCULÉ dynamiquement
  async findAll() {
    const chambres = await this.chambreRepository.find({
      relations: { type: true },
      order: { numero: 'ASC' },
    });

    const reservations = await this.reservationRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.chambre', 'chambre')
      .where('r.statut IN (:...statuts)', {
        statuts: ['confirmee', 'en_cours'],
      })
      .getMany();

    return chambres.map((chambre) => {
      const resaEnCours = reservations.find(
        (r) =>
          r.chambre?.id_chambre === chambre.id_chambre &&
          r.statut === 'en_cours',
      );

      const statutActuel =
        chambre.statut === 'maintenance'
          ? 'maintenance'
          : resaEnCours
            ? 'occupee'
            : 'disponible';

      return {
        ...chambre,
        statut: statutActuel, // ⬅️ statut calculé
      };
    });
  }
  async findOne(id: number) {
    const chambre = await this.chambreRepository.findOne({
      where: { id_chambre: id },
      relations: { type: true },
    });

    if (!chambre) return null;

    // Calcul du statut dynamique
    const resaEnCours = await this.reservationRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.chambre', 'chambre')
      .where('r.chambre = :id', { id })
      .andWhere('r.statut = :statut', { statut: 'en_cours' })
      .getOne();

    const statutActuel =
      chambre.statut === 'maintenance'
        ? 'maintenance'
        : resaEnCours
          ? 'occupee'
          : 'disponible';

    return {
      ...chambre,
      statut: statutActuel,
    };
  }

  async update(id: number, dto: UpdateChambreDto) {
    const { id_type, ...data } = dto;
    const chambre = await this.chambreRepository.findOneBy({ id_chambre: id });
    if (!chambre) {
      return null;
    }
    Object.assign(chambre, data);
    if (id_type !== undefined) {
      chambre.type = { id_type } as TypeChambre;
    }
    return this.chambreRepository.save(chambre);
  }

  async remove(id: number) {
    await this.chambreRepository.delete(id);
    return { deleted: true };
  }

  /**
   * État des chambres avec statut calculé + client actuel/prochain
   */
  async etatDesChambres() {
    const aujourdhui = new Date().toISOString().slice(0, 10);

    const chambres = await this.chambreRepository.find({
      relations: { type: true },
      order: { numero: 'ASC' },
    });

    const reservations = await this.reservationRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.client', 'client')
      .leftJoinAndSelect('r.chambre', 'chambre')
      .where('r.statut IN (:...statuts)', {
        statuts: ['confirmee', 'en_cours'],
      })
      .orderBy('r.date_arrivee', 'ASC')
      .getMany();

    return chambres.map((chambre) => {
      const resaEnCours = reservations.find(
        (r) =>
          r.chambre?.id_chambre === chambre.id_chambre &&
          r.statut === 'en_cours',
      );

      const resaFuture = reservations.find(
        (r) =>
          r.chambre?.id_chambre === chambre.id_chambre &&
          r.statut === 'confirmee' &&
          r.date_arrivee >= aujourdhui,
      );

      const statutActuel =
        chambre.statut === 'maintenance'
          ? 'maintenance'
          : resaEnCours
            ? 'occupee'
            : 'disponible';

      return {
        id_chambre: chambre.id_chambre,
        numero: chambre.numero,
        etage: chambre.etage,
        image: chambre.image,
        type: chambre.type,
        statutBase: chambre.statut,
        statutActuel,
        clientActuel: resaEnCours?.client
          ? `${resaEnCours.client.prenom} ${resaEnCours.client.nom}`
          : null,
        prochainClient: resaFuture?.client
          ? `${resaFuture.client.prenom} ${resaFuture.client.nom}`
          : null,
        prochaineArrivee: resaFuture?.date_arrivee || null,
      };
    });
  }
}
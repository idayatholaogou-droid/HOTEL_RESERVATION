import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../../client/entities/client.entity.js';
import { Chambre } from '../../chambre/entities/chambre.entity.js';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity.js';

@Entity('reservation')
export class Reservation {
  @PrimaryGeneratedColumn()
  id_reservation: number;

  @Column({ type: 'date' })
  date_arrivee: string;

  @Column({ type: 'date' })
  date_depart: string;

  @Column({ default: 'confirmee' })
  statut: string;

  @CreateDateColumn()
  date_creation: Date;

  @ManyToOne(() => Client, { nullable: false, eager: true })
  @JoinColumn({ name: 'id_client' })
  client: Client;

  @ManyToOne(() => Chambre, { nullable: false, eager: true })
  @JoinColumn({ name: 'id_chambre' })
  chambre: Chambre;

  @ManyToOne(() => Utilisateur, { nullable: false })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: Utilisateur;
}
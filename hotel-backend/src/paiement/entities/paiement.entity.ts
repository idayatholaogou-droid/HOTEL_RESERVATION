import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reservation } from '../../reservation/entities/reservation.entity.js';

@Entity('paiement')
export class Paiement {
  @PrimaryGeneratedColumn()
  id_paiement: number;

  @Column('decimal', { precision: 10, scale: 2 })
  montant: number;

  @CreateDateColumn()
  date_paiement: Date;

  @Column()
  mode: string;

  @ManyToOne(() => Reservation, { nullable: false, eager: true })
  @JoinColumn({ name: 'id_reservation' })
  reservation: Reservation;
}
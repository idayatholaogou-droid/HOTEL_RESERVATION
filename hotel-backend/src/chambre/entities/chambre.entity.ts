import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TypeChambre } from '../../type-chambre/entities/type-chambre.entity.js';

@Entity('chambre')
export class Chambre {
  @PrimaryGeneratedColumn()
  id_chambre: number;

  @Column()
  numero: string;

  @Column()
  etage: number;

  @Column()
  statut: string;

  @ManyToOne(() => TypeChambre, { nullable: false })
  @JoinColumn({ name: 'id_type' })
  type: TypeChambre;
}
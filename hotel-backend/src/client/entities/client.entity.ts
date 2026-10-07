import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity.js';

@Entity('client')
export class Client {
  @PrimaryGeneratedColumn()
  id_client: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  telephone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  adresse: string;

  @OneToOne(() => Utilisateur, { nullable: true })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: Utilisateur;
}
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('utilisateur')
export class Utilisateur {
  @PrimaryGeneratedColumn()
  id_utilisateur: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  login: string;

  @Column()
  mot_de_passe: string;

  @Column()
  role: string;
}
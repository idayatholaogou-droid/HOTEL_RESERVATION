import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('type_chambre')
export class TypeChambre {
  @PrimaryGeneratedColumn()
  id_type: number;

  @Column()
  libelle: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  prix_nuit: number;

  @Column()
  capacite: number;
}
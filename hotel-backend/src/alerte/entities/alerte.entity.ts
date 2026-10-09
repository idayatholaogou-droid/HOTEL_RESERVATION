import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('alerte')
export class Alerte {
  @PrimaryGeneratedColumn()
  id_alerte: number;

  @Column()
  type: string; // 'tentative_role_admin' | 'acces_refuse' | 'autre'

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true })
  login_concerne: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ default: false })
  vue: boolean;

  @CreateDateColumn()
  date_creation: Date;
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alerte } from './entities/alerte.entity.js';

@Injectable()
export class AlerteService {
  constructor(
    @InjectRepository(Alerte)
    private readonly alerteRepository: Repository<Alerte>,
  ) {}

  async creer(
    type: string,
    message: string,
    login_concerne?: string,
    ip?: string,
  ) {
    const alerte = this.alerteRepository.create({
      type,
      message,
      login_concerne,
      ip,
    });
    return this.alerteRepository.save(alerte);
  }

  findAll() {
    return this.alerteRepository.find({
      order: { date_creation: 'DESC' },
      take: 50,
    });
  }

  countNonVues() {
    return this.alerteRepository.count({ where: { vue: false } });
  }

  async marquerToutesVues() {
    await this.alerteRepository.update({ vue: false }, { vue: true });
    return { ok: true };
  }

  async remove(id: number) {
    await this.alerteRepository.delete(id);
    return { deleted: true };
  }
}
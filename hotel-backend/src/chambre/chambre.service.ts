import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChambreDto } from './dto/create-chambre.dto.js';
import { UpdateChambreDto } from './dto/update-chambre.dto.js';
import { Chambre } from './entities/chambre.entity.js';
import { TypeChambre } from '../type-chambre/entities/type-chambre.entity.js';

@Injectable()
export class ChambreService {
  constructor(
    @InjectRepository(Chambre)
    private readonly chambreRepository: Repository<Chambre>,
  ) {}

  create(dto: CreateChambreDto) {
    const { id_type, ...data } = dto;
    const chambre = this.chambreRepository.create({
      ...data,
      type: { id_type },
    });
    return this.chambreRepository.save(chambre);
  }

  findAll() {
    return this.chambreRepository.find();
  }

  findOne(id: number) {
    return this.chambreRepository.findOneBy({ id_chambre: id });
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
}
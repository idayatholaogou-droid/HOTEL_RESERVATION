import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTypeChambreDto } from './dto/create-type-chambre.dto.js';
import { UpdateTypeChambreDto } from './dto/update-type-chambre.dto.js';
import { TypeChambre } from './entities/type-chambre.entity.js';

@Injectable()
export class TypeChambreService {
  constructor(
    @InjectRepository(TypeChambre)
    private readonly typeChambreRepository: Repository<TypeChambre>,
  ) {}

  create(dto: CreateTypeChambreDto) {
    const typeChambre = this.typeChambreRepository.create(dto);
    return this.typeChambreRepository.save(typeChambre);
  }

  findAll() {
    return this.typeChambreRepository.find();
  }

  findOne(id: number) {
    return this.typeChambreRepository.findOneBy({ id_type: id });
  }

  async update(id: number, dto: UpdateTypeChambreDto) {
    await this.typeChambreRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.typeChambreRepository.delete(id);
    return { deleted: true };
  }
}
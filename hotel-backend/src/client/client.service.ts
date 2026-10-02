import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { Client } from './entities/client.entity.js';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  create(dto: CreateClientDto) {
    const client = this.clientRepository.create(dto);
    return this.clientRepository.save(client);
  }

  findAll() {
    return this.clientRepository.find();
  }

  findOne(id: number) {
    return this.clientRepository.findOneBy({ id_client: id });
  }

  async update(id: number, dto: UpdateClientDto) {
    await this.clientRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.clientRepository.delete(id);
    return { deleted: true };
  }
}
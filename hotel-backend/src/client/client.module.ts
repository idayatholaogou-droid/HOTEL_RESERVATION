import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './client.service.js';
import { ClientController } from './client.controller.js';
import { Client } from './entities/client.entity.js';
import { AlerteModule } from '../alerte/alerte.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    AlerteModule,   // ⬅️ pour injecter AlerteService
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
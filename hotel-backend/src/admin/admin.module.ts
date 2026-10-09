import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service.js';
import { AdminController } from './admin.controller.js';
import { Chambre } from '../chambre/entities/chambre.entity.js';
import { Client } from '../client/entities/client.entity.js';
import { Reservation } from '../reservation/entities/reservation.entity.js';
import { Paiement } from '../paiement/entities/paiement.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chambre, Client, Reservation, Paiement]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChambreService } from './chambre.service.js';
import { ChambreController } from './chambre.controller.js';
import { Chambre } from './entities/chambre.entity.js';
import { Reservation } from '../reservation/entities/reservation.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Chambre, Reservation])],
  controllers: [ChambreController],
  providers: [ChambreService],
})
export class ChambreModule {}
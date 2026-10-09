import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaiementService } from './paiement.service.js';
import { PaiementController } from './paiement.controller.js';
import { Paiement } from './entities/paiement.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Paiement])],
  controllers: [PaiementController],
  providers: [PaiementService],
})
export class PaiementModule {}
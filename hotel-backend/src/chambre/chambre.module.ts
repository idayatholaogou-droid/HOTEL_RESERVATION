import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChambreService } from './chambre.service.js';
import { ChambreController } from './chambre.controller.js';
import { Chambre } from './entities/chambre.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Chambre])],
  controllers: [ChambreController],
  providers: [ChambreService],
})
export class ChambreModule {}
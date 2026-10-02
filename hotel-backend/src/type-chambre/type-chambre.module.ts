import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeChambreService } from './type-chambre.service.js';
import { TypeChambreController } from './type-chambre.controller.js';
import { TypeChambre } from './entities/type-chambre.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([TypeChambre])],
  controllers: [TypeChambreController],
  providers: [TypeChambreService],
})
export class TypeChambreModule {}
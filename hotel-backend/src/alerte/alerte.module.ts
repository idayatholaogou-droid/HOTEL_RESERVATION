import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlerteService } from './alerte.service.js';
import { AlerteController } from './alerte.controller.js';
import { Alerte } from './entities/alerte.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Alerte])],
  controllers: [AlerteController],
  providers: [AlerteService],
  exports: [AlerteService],
})
export class AlerteModule {}
import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule, InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PaiementService } from './paiement.service.js';
import { PaiementController } from './paiement.controller.js';
import { Paiement } from './entities/paiement.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Paiement])],
  controllers: [PaiementController],
  providers: [PaiementService],
})
export class PaiementModule implements OnModuleInit {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  onModuleInit() {
    const entities = this.dataSource.entityMetadatas.map((m) => m.tableName);
    Logger.log(`📋 Tables vues par TypeORM : ${entities.join(', ')}`, 'PaiementModule');
    Logger.log(`🔎 Paiement présent ? ${entities.includes('paiement')}`, 'PaiementModule');
  }
}
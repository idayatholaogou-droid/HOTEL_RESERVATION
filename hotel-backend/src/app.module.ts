import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeChambreModule } from './type-chambre/type-chambre.module.js';
import { ChambreModule } from './chambre/chambre.module.js';
import { ClientModule } from './client/client.module.js';
import { UtilisateurModule } from './utilisateur/utilisateur.module.js';
import { ReservationModule } from './reservation/reservation.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '1412',
      database: 'HOTEL_RESERVATION',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeChambreModule,
    ChambreModule,
    ClientModule,
    UtilisateurModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
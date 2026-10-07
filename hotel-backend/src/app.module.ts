import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeChambreModule } from './type-chambre/type-chambre.module.js';
import { ChambreModule } from './chambre/chambre.module.js';
import { ClientModule } from './client/client.module.js';
import { UtilisateurModule } from './utilisateur/utilisateur.module.js';
import { ReservationModule } from './reservation/reservation.module.js';
import { PaiementModule } from './paiement/paiement.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        logging: true,
        synchronize: true,
      }),
    }),
    TypeChambreModule,
    ChambreModule,
    ClientModule,
    UtilisateurModule,
    ReservationModule,
    PaiementModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
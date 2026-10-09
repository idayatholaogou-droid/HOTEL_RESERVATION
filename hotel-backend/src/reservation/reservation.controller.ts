import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { ReservationService } from './reservation.service.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { UpdateReservationDto } from './dto/update-reservation.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

type RequeteAuth = ExpressRequest & {
  user: {
    id_utilisateur: number;
    login: string;
    role: string;
    id_client: number | null;
  };
};

@Controller('reservation')
@UseGuards(JwtAuthGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // ==========================================
  // PUBLIC
  // ==========================================

  // 🔓 PUBLIC : voir les avis d'une chambre
  @Get('avis/chambre/:id_chambre')
  avisChambre(@Param('id_chambre') id_chambre: string) {
    return this.reservationService.avisParChambre(+id_chambre);
  }

  // ==========================================
  // CLIENT connecté
  // ==========================================

  // 🔒 CLIENT : créer SA réservation (id_client du token)
  @Post()
  create(@Body() dto: CreateReservationDto, @Request() req: RequeteAuth) {
    const id_client = req.user.id_client;
    if (id_client === null) {
      throw new ForbiddenException('Seul un client peut créer une réservation');
    }
    return this.reservationService.create({ ...dto, id_client });
  }

  // 🔒 CLIENT : voir SES réservations
  @Get('mes-reservations')
  mesReservations(@Request() req: RequeteAuth) {
    const id_client = req.user.id_client;
    if (id_client === null) {
      throw new ForbiddenException(
        'Seul un client peut consulter ses réservations',
      );
    }
    return this.reservationService.findByClient(id_client);
  }

  // 🔒 CLIENT : ajouter un avis sur SA réservation
  @Patch(':id/avis')
  ajouterAvis(
    @Param('id') id: string,
    @Body() body: { note: number; commentaire: string },
    @Request() req: RequeteAuth,
  ) {
    const id_client = req.user.id_client;
    if (id_client === null) {
      throw new ForbiddenException('Seul un client peut laisser un avis');
    }
    return this.reservationService.ajouterAvis(
      +id,
      id_client,
      body.note,
      body.commentaire,
    );
  }

  // 🔒 CLIENT : annuler SA réservation
  @Patch(':id/annuler')
  annuler(@Param('id') id: string) {
    return this.reservationService.annuler(+id);
  }

  // ==========================================
  // RÉCEPTIONNISTE + ADMIN
  // ==========================================

  // 🔒 RÉCEP + ADMIN : planning du jour
  @Get('planning/jour')
  @UseGuards(RolesGuard)
  @Roles('receptionniste', 'admin')
  planningJour() {
    return this.reservationService.reservationsDuJour();
  }

  // 🔒 RÉCEPTIONNISTE : créer une réservation AU COMPTOIR
  @Post('comptoir')
  @UseGuards(RolesGuard)
  @Roles('receptionniste')
  createComptoir(@Body() dto: CreateReservationDto) {
    return this.reservationService.create(dto);
  }

  // 🔒 RÉCEPTIONNISTE + ADMIN : check-in
  @Patch(':id/check-in')
  @UseGuards(RolesGuard)
  @Roles('receptionniste', 'admin')
  checkIn(@Param('id') id: string) {
    return this.reservationService.checkIn(+id);
  }

  // 🔒 RÉCEPTIONNISTE + ADMIN : check-out
  @Patch(':id/check-out')
  @UseGuards(RolesGuard)
  @Roles('receptionniste', 'admin')
  checkOut(@Param('id') id: string) {
    return this.reservationService.checkOut(+id);
  }

  // 🔒 RÉCEP + ADMIN : voir TOUTES les réservations
  @Get()
  @UseGuards(RolesGuard)
  @Roles('receptionniste', 'admin')
  findAll() {
    return this.reservationService.findAllComplet();
  }

  // 🔒 RÉCEP + ADMIN : modifier une réservation
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('receptionniste', 'admin')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(+id, updateReservationDto);
  }

  // ==========================================
  // ADMIN uniquement
  // ==========================================

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(+id);
  }

  // ⚠️ Route `:id` EN DERNIER
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(+id);
  }
}
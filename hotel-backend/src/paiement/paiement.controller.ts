import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { PaiementService } from './paiement.service.js';
import { CreatePaiementDto } from './dto/create-paiement.dto.js';
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

@Controller('paiement')
@UseGuards(JwtAuthGuard)
export class PaiementController {
  constructor(private readonly paiementService: PaiementService) {}

  // 🔒 Créer un paiement (client connecté)
  @Post()
  create(@Body() dto: CreatePaiementDto, @Request() req: RequeteAuth) {
    return this.paiementService.create(dto, req.user);
  }

  // 👑 Admin + Récep : voir tous les paiements
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'receptionniste')
  findAll() {
    return this.paiementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paiementService.findOne(+id);
  }
}
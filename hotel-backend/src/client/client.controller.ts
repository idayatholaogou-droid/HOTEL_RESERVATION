import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { InscriptionDto } from './dto/inscription.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  //  PUBLIC : inscription en ligne (client lui-même)
  @Post('inscription')
  inscrire(@Body() dto: InscriptionDto) {
    return this.clientService.inscrire(dto);
  }

  //  RÉCEPTIONNISTE : créer un client walk-in
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('receptionniste')
  create(@Body() dto: CreateClientDto) {
    return this.clientService.create(dto);
  }

    //  ADMIN : statistiques clients
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  stats() {
    return this.clientService.statistiques();
  }

  //  RÉCEP + ADMIN : voir tous les clients
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('receptionniste', 'admin')
  findAll() {
    return this.clientService.findAll();
  }

  //  RÉCEP + ADMIN : voir un client
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('receptionniste', 'admin')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(+id);
  }

  //  RÉCEPTIONNISTE : modifier un client
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('receptionniste')
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientService.update(+id, dto);
  }

  //  ADMIN : supprimer un client
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }
}
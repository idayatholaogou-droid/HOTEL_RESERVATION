import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service.js';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto.js';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('utilisateur')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}

  //  PUBLIC : login
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.utilisateurService.login(
      loginDto.login,
      loginDto.mot_de_passe,
    );
  }

  //  ADMIN : créer un utilisateur (avec n'importe quel rôle)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateUtilisateurDto) {
    return this.utilisateurService.create(dto);
  }

  //  ADMIN : lister tous les utilisateurs
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.utilisateurService.findAll();
  }

  //  ADMIN : voir un utilisateur
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.utilisateurService.findOne(+id);
  }

  // ADMIN : modifier un utilisateur
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUtilisateurDto,
  ) {
    return this.utilisateurService.update(+id, dto);
  }

  // ADMIN : supprimer un utilisateur
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.utilisateurService.remove(+id);
  }
}
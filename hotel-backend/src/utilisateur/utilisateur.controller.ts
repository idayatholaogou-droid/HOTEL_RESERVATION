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

@Controller('utilisateur')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.utilisateurService.login(
      loginDto.login,
      loginDto.mot_de_passe,
    );
  }

  @Post()
  create(@Body() createUtilisateurDto: CreateUtilisateurDto) {
    return this.utilisateurService.create(createUtilisateurDto);
  }

  //  Protégée : nécessite un token JWT
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.utilisateurService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.utilisateurService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUtilisateurDto: UpdateUtilisateurDto,
  ) {
    return this.utilisateurService.update(+id, updateUtilisateurDto);
  }

  //  Protégée : nécessite un token JWT
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.utilisateurService.remove(+id);
  }
}
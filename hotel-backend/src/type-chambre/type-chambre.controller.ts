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
import { TypeChambreService } from './type-chambre.service.js';
import { CreateTypeChambreDto } from './dto/create-type-chambre.dto.js';
import { UpdateTypeChambreDto } from './dto/update-type-chambre.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('type-chambre')
export class TypeChambreController {
  constructor(private readonly typeChambreService: TypeChambreService) {}

  //  PUBLIC : liste des types (nécessaire pour l'affichage)
  @Get()
  findAll() {
    return this.typeChambreService.findAll();
  }

  //  PUBLIC : détail d'un type
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeChambreService.findOne(+id);
  }

  //  ADMIN : créer
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateTypeChambreDto) {
    return this.typeChambreService.create(dto);
  }

  //  ADMIN : modifier (PRIX !)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateTypeChambreDto) {
    return this.typeChambreService.update(+id, dto);
  }

  //  ADMIN : supprimer
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.typeChambreService.remove(+id);
  }
}
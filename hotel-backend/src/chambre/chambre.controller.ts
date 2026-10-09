import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ChambreService } from './chambre.service.js';
import { CreateChambreDto } from './dto/create-chambre.dto.js';
import { UpdateChambreDto } from './dto/update-chambre.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('chambre')
export class ChambreController {
  constructor(private readonly chambreService: ChambreService) {}


  @Get()
  findAll() {
    return this.chambreService.findAll();
  }

  // RÉCEP + ADMIN : état détaillé

  //  RÉCEP + ADMIN : état des chambres (occupées, clients, etc.)
  @Get('etat/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('receptionniste', 'admin')
  etatDesChambres() {
    return this.chambreService.etatDesChambres();
  }

  // ADMIN : gestion des chambres

  //  ADMIN : uploader une image
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const nom = `chambre-${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extname(file.originalname)}`;
          cb(null, nom);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException(
              'Seules les images (jpg, jpeg, png, webp) sont autorisées',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier reçu');
    }
    return {
      filename: file.filename,
      url: `/uploads/${file.filename}`,
    };
  }

  //  ADMIN : créer une chambre
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateChambreDto) {
    return this.chambreService.create(dto);
  }

  //  ADMIN : modifier une chambre
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateChambreDto) {
    return this.chambreService.update(+id, dto);
  }

  //  ADMIN : supprimer une chambre
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.chambreService.remove(+id);
  }

  //  Route `:id` EN DERNIER
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chambreService.findOne(+id);
  }
}
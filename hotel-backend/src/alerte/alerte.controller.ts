import {
  Controller,
  Get,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AlerteService } from './alerte.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('alerte')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AlerteController {
  constructor(private readonly alerteService: AlerteService) {}

  @Get()
  findAll() {
    return this.alerteService.findAll();
  }

  @Get('count')
  count() {
    return this.alerteService.countNonVues();
  }

  @Patch('tout-vu')
  marquerToutesVues() {
    return this.alerteService.marquerToutesVues();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alerteService.remove(+id);
  }
}
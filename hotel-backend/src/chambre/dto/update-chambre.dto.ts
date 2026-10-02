import { PartialType } from '@nestjs/mapped-types';
import { CreateChambreDto } from './create-chambre.dto.js';

export class UpdateChambreDto extends PartialType(CreateChambreDto) {}

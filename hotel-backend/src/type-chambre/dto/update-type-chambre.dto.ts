import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeChambreDto } from './create-type-chambre.dto.js';

export class UpdateTypeChambreDto extends PartialType(CreateTypeChambreDto) {}

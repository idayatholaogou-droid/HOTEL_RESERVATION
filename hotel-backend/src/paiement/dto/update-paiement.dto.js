import { PartialType } from '@nestjs/mapped-types';
import { CreatePaiementDto } from './create-paiement.dto.js';
export class UpdatePaiementDto extends PartialType(CreatePaiementDto) {
}

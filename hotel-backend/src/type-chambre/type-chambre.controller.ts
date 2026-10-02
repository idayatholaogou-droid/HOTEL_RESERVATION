import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypeChambreService } from './type-chambre.service.js';
import { CreateTypeChambreDto } from './dto/create-type-chambre.dto.js';
import { UpdateTypeChambreDto } from './dto/update-type-chambre.dto.js';

@Controller('type-chambre')
export class TypeChambreController {
  constructor(private readonly typeChambreService: TypeChambreService) {}

  @Post()
  create(@Body() createTypeChambreDto: CreateTypeChambreDto) {
    return this.typeChambreService.create(createTypeChambreDto);
  }

  @Get()
  findAll() {
    return this.typeChambreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeChambreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeChambreDto: UpdateTypeChambreDto) {
    return this.typeChambreService.update(+id, updateTypeChambreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeChambreService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { PatrocinadoresService } from './patrocinadores.service';
import { CreatePatrocinadorDto } from './dto/create-patrocinador.dto';
import { UpdatePatrocinadorDto } from './dto/update-patrocinador.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Patrocinadores')
@Controller('patrocinadores')
export class PatrocinadoresController {
  constructor(private readonly patrocinadoresService: PatrocinadoresService) {}

  @ApiOperation({ summary: 'Listar todos os patrocinadores ativos (Público)' })
  @Get()
  findAllActive() {
    return this.patrocinadoresService.findAll(true);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Listar TODOS os patrocinadores (Admin)' })
  @Get('admin')
  findAll() {
    return this.patrocinadoresService.findAll(false);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Criar patrocinador' })
  @Post()
  create(@Body() createDto: CreatePatrocinadorDto) {
    return this.patrocinadoresService.create(createDto);
  }

  @ApiOperation({ summary: 'Buscar patrocinador por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patrocinadoresService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Atualizar patrocinador' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdatePatrocinadorDto) {
    return this.patrocinadoresService.update(id, updateDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Deletar patrocinador (Apenas ADMIN)' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patrocinadoresService.remove(id);
  }
}

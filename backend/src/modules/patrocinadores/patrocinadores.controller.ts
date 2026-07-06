import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { PatrocinadoresService } from './patrocinadores.service';
import { CreatePatrocinadorDto } from './dto/create-patrocinador.dto';
import { UpdatePatrocinadorDto } from './dto/update-patrocinador.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminAuth } from '../../common/decorators/admin-auth.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';

@ApiTags('Patrocinadores')
@Controller()
export class PatrocinadoresController {
  constructor(private readonly patrocinadoresService: PatrocinadoresService) {}

  // === ROTAS PÚBLICAS ===
  @ApiOperation({ summary: 'Listar todos os patrocinadores ativos (Público)' })
  @Get('patrocinadores')
  findAllActive(@Query() paginationDto: PaginationDto) {
    return this.patrocinadoresService.findAllPublic(paginationDto);
  }

  // === ROTAS ADMINISTRATIVAS PROTEGIDAS ===
  @ApiOperation({ summary: 'Listar TODOS os patrocinadores (Admin)' })
  @Get('admin/patrocinadores')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.patrocinadoresService.findAllAdmin(paginationDto);
  }

  @ApiOperation({ summary: 'Criar patrocinador' })
  @Post('admin/patrocinadores')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() createDto: CreatePatrocinadorDto) {
    return this.patrocinadoresService.create(createDto);
  }

  @ApiOperation({ summary: 'Buscar patrocinador por ID' })
  @Get('admin/patrocinadores/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findOne(@Param('id') id: string) {
    return this.patrocinadoresService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar patrocinador' })
  @Put('admin/patrocinadores/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() updateDto: UpdatePatrocinadorDto) {
    return this.patrocinadoresService.update(id, updateDto);
  }

  @ApiOperation({ summary: 'Deletar patrocinador (Apenas ADMIN)' })
  @Delete('admin/patrocinadores/:id')
  @AdminAuth(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.patrocinadoresService.remove(id);
  }
}

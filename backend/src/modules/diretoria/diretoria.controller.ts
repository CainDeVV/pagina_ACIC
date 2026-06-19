import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DiretoriaService } from './diretoria.service';
import { CreateDiretoriaDto } from './dto/create-diretoria.dto';
import { UpdateDiretoriaDto } from './dto/update-diretoria.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Diretoria')
@Controller()
export class DiretoriaController {
  constructor(private readonly diretoriaService: DiretoriaService) {}

  // ROTAS PÚBLICAS
  @Get('diretoria')
  findAll() {
    return this.diretoriaService.findAll();
  }

  @Get('diretoria/:id')
  findOne(@Param('id') id: string) {
    return this.diretoriaService.findOne(id);
  }

  // ROTAS ADMINISTRATIVAS
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Post('admin/diretoria')
  create(@Body() createDiretoriaDto: CreateDiretoriaDto) {
    return this.diretoriaService.create(createDiretoriaDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Patch('admin/diretoria/:id')
  update(@Param('id') id: string, @Body() updateDiretoriaDto: UpdateDiretoriaDto) {
    return this.diretoriaService.update(id, updateDiretoriaDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Delete('admin/diretoria/:id')
  remove(@Param('id') id: string) {
    return this.diretoriaService.remove(id);
  }
}
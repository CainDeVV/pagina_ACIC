import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ServicosService } from './servicos.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Servicos')
@Controller()
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  // ROTA PÚBLICA: O Frontend React consome aqui livremente
  @Get('servicos')
  findAll() {
    return this.servicosService.findAll();
  }

  // ROTA PÚBLICA: Busca por ID ou por Slug (Ex: /api/servicos/registro-de-marcas)
  @Get('servicos/:idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.servicosService.findOne(idOrSlug);
  }

  // ROTAS ADMINISTRATIVAS PROTEGIDAS
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Post('admin/servicos')
  create(@Body() createServicoDto: CreateServicoDto, @CurrentUser() user: any) {
    return this.servicosService.create(createServicoDto, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Patch('admin/servicos/:id')
  update(@Param('id') id: string, @Body() updateServicoDto: UpdateServicoDto) {
    return this.servicosService.update(id, updateServicoDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Delete('admin/servicos/:id')
  remove(@Param('id') id: string) {
    return this.servicosService.remove(id);
  }
}
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Eventos')
@Controller()
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  // ROTAS PÚBLICAS
  @Get('eventos')
  findAll() {
    return this.eventosService.findAll();
  }

  @Get('eventos/:idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.eventosService.findOne(idOrSlug);
  }

  // ROTAS ADMINISTRATIVAS
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Post('admin/eventos')
  create(@Body() createEventoDto: CreateEventoDto, @CurrentUser() user: any) {
    return this.eventosService.create(createEventoDto, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Patch('admin/eventos/:id')
  update(@Param('id') id: string, @Body() updateEventoDto: UpdateEventoDto) {
    return this.eventosService.update(id, updateEventoDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Delete('admin/eventos/:id')
  remove(@Param('id') id: string) {
    return this.eventosService.remove(id);
  }
}
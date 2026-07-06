import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { AdminAuth } from '../../common/decorators/admin-auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-user.interface';
import { UserRole } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Eventos')
@Controller()
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  // ── ROTAS PÚBLICAS (slug) ──
  @ApiOperation({ summary: 'Listar eventos publicados' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de eventos publicados.',
  })
  @Get('eventos')
  findAll(@Query() pagination: PaginationDto) {
    return this.eventosService.findAll(pagination);
  }

  @ApiOperation({ summary: 'Buscar evento por slug' })
  @ApiParam({ name: 'slug', description: 'Slug gerado a partir do título' })
  @ApiResponse({ status: 200, description: 'Evento encontrado.' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  @Get('eventos/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.eventosService.findBySlug(slug);
  }

  // ── ROTAS ADMINISTRATIVAS (ID) ──
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Listar todos os eventos (admin)' })
  @Get('admin/eventos')
  findAllAdmin(@Query() pagination: PaginationDto) {
    return this.eventosService.findAllAdmin(pagination);
  }

  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Buscar evento por ID (admin)' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  @Get('admin/eventos/:id')
  findOne(@Param('id') id: string) {
    return this.eventosService.findOne(id);
  }

  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Criar novo evento' })
  @ApiResponse({ status: 201, description: 'Evento criado com sucesso.' })
  @ApiResponse({ status: 409, description: 'Evento com título duplicado.' })
  @Post('admin/eventos')
  create(@Body() dto: CreateEventoDto, @CurrentUser() user: JwtPayload) {
    return this.eventosService.create(dto, user.id);
  }

  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Atualizar evento' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  @Patch('admin/eventos/:id')
  update(@Param('id') id: string, @Body() dto: UpdateEventoDto) {
    return this.eventosService.update(id, dto);
  }

  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Remover evento' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  @Delete('admin/eventos/:id')
  remove(@Param('id') id: string) {
    return this.eventosService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServicosService } from './servicos.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { AdminAuth } from '../../common/decorators/admin-auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';

@ApiTags('Servicos')
@Controller()
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  // === ROTAS PÚBLICAS ===
  @Get('servicos')
  findAllPublic(@Query() paginationDto: PaginationDto) {
    return this.servicosService.findAllPublic(paginationDto);
  }

  @Get('servicos/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.servicosService.findBySlug(slug);
  }

  // === ROTAS ADMINISTRATIVAS PROTEGIDAS ===
  @Get('admin/servicos')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.servicosService.findAllAdmin(paginationDto);
  }

  @Get('admin/servicos/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findOneAdmin(@Param('id') id: string) {
    return this.servicosService.findOne(id);
  }

  @Post('admin/servicos')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() createServicoDto: CreateServicoDto, @CurrentUser() user: any) {
    return this.servicosService.create(createServicoDto, user.id);
  }

  @Patch('admin/servicos/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() updateServicoDto: UpdateServicoDto) {
    return this.servicosService.update(id, updateServicoDto);
  }

  @Delete('admin/servicos/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  remove(@Param('id') id: string) {
    return this.servicosService.remove(id);
  }
}
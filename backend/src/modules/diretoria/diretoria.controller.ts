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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DiretoriaService } from './diretoria.service';
import { CreateDiretoriaDto } from './dto/create-diretoria.dto';
import { UpdateDiretoriaDto } from './dto/update-diretoria.dto';
import { AdminAuth } from '../../common/decorators/admin-auth.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';

@ApiTags('Diretoria')
@Controller()
export class DiretoriaController {
  constructor(private readonly diretoriaService: DiretoriaService) {}

  // ROTAS PÚBLICAS
  @ApiOperation({ summary: 'Listar diretoria (Público)' })
  @ApiResponse({ status: 200, description: 'Lista de membros da diretoria.' })
  @Get('diretoria')
  findAllPublic(@Query() paginationDto: PaginationDto) {
    return this.diretoriaService.findAllPublic(paginationDto);
  }

  // ROTAS ADMINISTRATIVAS
  @ApiOperation({ summary: 'Listar diretoria (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de membros da diretoria.' })
  @Get('admin/diretoria')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.diretoriaService.findAllAdmin(paginationDto);
  }

  @ApiOperation({ summary: 'Buscar membro da diretoria por ID' })
  @ApiResponse({ status: 200, description: 'Membro encontrado.' })
  @ApiResponse({ status: 404, description: 'Membro não encontrado.' })
  @Get('admin/diretoria/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findOne(@Param('id') id: string) {
    return this.diretoriaService.findOne(id);
  }

  @ApiOperation({ summary: 'Criar novo membro da diretoria' })
  @ApiResponse({ status: 201, description: 'Membro criado com sucesso.' })
  @Post('admin/diretoria')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() createDiretoriaDto: CreateDiretoriaDto) {
    return this.diretoriaService.create(createDiretoriaDto);
  }

  @ApiOperation({ summary: 'Atualizar membro da diretoria' })
  @ApiResponse({ status: 200, description: 'Membro atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Membro não encontrado.' })
  @Patch('admin/diretoria/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  update(
    @Param('id') id: string,
    @Body() updateDiretoriaDto: UpdateDiretoriaDto,
  ) {
    return this.diretoriaService.update(id, updateDiretoriaDto);
  }

  @ApiOperation({ summary: 'Remover membro da diretoria' })
  @ApiResponse({ status: 200, description: 'Membro removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Membro não encontrado.' })
  @Delete('admin/diretoria/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  remove(@Param('id') id: string) {
    return this.diretoriaService.remove(id);
  }
}

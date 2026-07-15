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
import { PresidentesService } from './presidentes.service';
import { CreatePresidenteDto } from './dto/create-presidente.dto';
import { UpdatePresidenteDto } from './dto/update-presidente.dto';
import { AdminAuth } from '../../common/decorators/admin-auth.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';

@ApiTags('Presidentes')
@Controller()
export class PresidentesController {
  constructor(private readonly presidentesService: PresidentesService) {}

  @ApiOperation({ summary: 'Listar presidentes (Público)' })
  @ApiResponse({ status: 200, description: 'Lista de presidentes.' })
  @Get('presidentes')
  findAllPublic(@Query() paginationDto: PaginationDto) {
    return this.presidentesService.findAllPublic(paginationDto);
  }

  @ApiOperation({ summary: 'Listar presidentes (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de presidentes.' })
  @Get('admin/presidentes')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.presidentesService.findAllAdmin(paginationDto);
  }

  @ApiOperation({ summary: 'Buscar presidente por ID' })
  @ApiResponse({ status: 200, description: 'Presidente encontrado.' })
  @ApiResponse({ status: 404, description: 'Presidente não encontrado.' })
  @Get('admin/presidentes/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findOne(@Param('id') id: string) {
    return this.presidentesService.findOne(id);
  }

  @ApiOperation({ summary: 'Criar novo presidente' })
  @ApiResponse({ status: 201, description: 'Presidente criado com sucesso.' })
  @Post('admin/presidentes')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() createPresidenteDto: CreatePresidenteDto) {
    return this.presidentesService.create(createPresidenteDto);
  }

  @ApiOperation({ summary: 'Atualizar presidente' })
  @ApiResponse({
    status: 200,
    description: 'Presidente atualizado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Presidente não encontrado.' })
  @Patch('admin/presidentes/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  update(
    @Param('id') id: string,
    @Body() updatePresidenteDto: UpdatePresidenteDto,
  ) {
    return this.presidentesService.update(id, updatePresidenteDto);
  }

  @ApiOperation({ summary: 'Remover presidente' })
  @ApiResponse({ status: 200, description: 'Presidente removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Presidente não encontrado.' })
  @Delete('admin/presidentes/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  remove(@Param('id') id: string) {
    return this.presidentesService.remove(id);
  }
}

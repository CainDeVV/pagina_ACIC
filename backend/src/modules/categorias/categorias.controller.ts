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
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { AdminAuth } from '../../common/decorators/admin-auth.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';

@ApiTags('Categorias')
@Controller()
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  // === ROTAS PÚBLICAS ===
  @ApiOperation({ summary: 'Listar categorias ativas (Público)' })
  @ApiResponse({ status: 200, description: 'Lista de categorias ativas.' })
  @Get('categorias/ativas')
  findActive() {
    return this.categoriasService.findActive();
  }

  // === ROTAS ADMINISTRATIVAS PROTEGIDAS ===
  @ApiOperation({ summary: 'Listar todas as categorias (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de todas as categorias.' })
  @Get('admin/categorias')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.categoriasService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiResponse({ status: 200, description: 'Categoria encontrada.' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
  @Get('admin/categorias/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findOneAdmin(@Param('id') id: string) {
    return this.categoriasService.findOne(id);
  }

  @ApiOperation({ summary: 'Criar nova categoria' })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso.' })
  @Post('admin/categorias')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @ApiOperation({ summary: 'Atualizar categoria' })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
  @Patch('admin/categorias/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @ApiOperation({ summary: 'Remover categoria' })
  @ApiResponse({ status: 200, description: 'Categoria removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
  @Delete('admin/categorias/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  remove(@Param('id') id: string) {
    return this.categoriasService.remove(id);
  }
}

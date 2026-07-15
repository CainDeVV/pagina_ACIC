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
import { ApiTags } from '@nestjs/swagger';
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
  @Get('categorias/ativas')
  findActive() {
    return this.categoriasService.findActive();
  }

  // === ROTAS ADMINISTRATIVAS PROTEGIDAS ===
  @Get('admin/categorias')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.categoriasService.findAll(paginationDto);
  }

  @Get('admin/categorias/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findOneAdmin(@Param('id') id: string) {
    return this.categoriasService.findOne(id);
  }

  @Post('admin/categorias')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Patch('admin/categorias/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @Delete('admin/categorias/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  remove(@Param('id') id: string) {
    return this.categoriasService.remove(id);
  }
}

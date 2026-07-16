import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NoticiasService } from './noticias.service';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { AdminAuth } from '../../common/decorators/admin-auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-user.interface';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';

@ApiTags('Noticias')
@Controller()
export class NoticiasController {
  constructor(private readonly noticiasService: NoticiasService) {}

  // === ROTAS PÚBLICAS ===
  @ApiOperation({ summary: 'Listar notícias (Público)' })
  @ApiResponse({ status: 200, description: 'Lista de notícias retornada.' })
  @Get('noticias')
  @UseInterceptors(CacheInterceptor)
  findAllPublic(@Query() paginationDto: PaginationDto) {
    return this.noticiasService.findAllPublic(paginationDto);
  }

  @ApiOperation({ summary: 'Buscar notícia por slug (Público)' })
  @ApiResponse({ status: 200, description: 'Notícia encontrada.' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada.' })
  @Get('noticias/:slug')
  @UseInterceptors(CacheInterceptor)
  findBySlug(@Param('slug') slug: string) {
    return this.noticiasService.findBySlug(slug);
  }

  // === ROTAS ADMINISTRATIVAS PROTEGIDAS ===
  @ApiOperation({ summary: 'Listar todas as notícias (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de todas as notícias.' })
  @Get('admin/noticias')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.noticiasService.findAllAdmin(paginationDto);
  }

  @ApiOperation({ summary: 'Buscar notícia por ID' })
  @ApiResponse({ status: 200, description: 'Notícia encontrada.' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada.' })
  @Get('admin/noticias/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findOneAdmin(@Param('id') id: string) {
    return this.noticiasService.findOne(id);
  }

  @ApiOperation({ summary: 'Criar nova notícia' })
  @ApiResponse({ status: 201, description: 'Notícia criada com sucesso.' })
  @Post('admin/noticias')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  create(
    @Body() createNoticiaDto: CreateNoticiaDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.noticiasService.create(createNoticiaDto, user.id);
  }

  @ApiOperation({ summary: 'Atualizar notícia' })
  @ApiResponse({ status: 200, description: 'Notícia atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada.' })
  @Patch('admin/noticias/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() updateNoticiaDto: UpdateNoticiaDto) {
    return this.noticiasService.update(id, updateNoticiaDto);
  }

  @ApiOperation({ summary: 'Remover notícia' })
  @ApiResponse({ status: 200, description: 'Notícia removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada.' })
  @Delete('admin/noticias/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  remove(@Param('id') id: string) {
    return this.noticiasService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NoticiasService } from './noticias.service';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Noticias')
@Controller()
export class NoticiasController {
  constructor(private readonly noticiasService: NoticiasService) {}

  // ROTAS PÚBLICAS
  @Get('noticias')
  findAll() {
    return this.noticiasService.findAll();
  }

  @Get('noticias/:idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.noticiasService.findOne(idOrSlug);
  }

  // ROTAS ADMINISTRATIVAS PROTEGIDAS
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Post('admin/noticias')
  create(@Body() createNoticiaDto: CreateNoticiaDto, @CurrentUser() user: any) {
    return this.noticiasService.create(createNoticiaDto, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Patch('admin/noticias/:id')
  update(@Param('id') id: string, @Body() updateNoticiaDto: UpdateNoticiaDto) {
    return this.noticiasService.update(id, updateNoticiaDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @Delete('admin/noticias/:id')
  remove(@Param('id') id: string) {
    return this.noticiasService.remove(id);
  }
}

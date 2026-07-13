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
  @Get('noticias')
  findAllPublic(@Query() paginationDto: PaginationDto) {
    return this.noticiasService.findAllPublic(paginationDto);
  }

  @Get('noticias/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.noticiasService.findBySlug(slug);
  }

  // === ROTAS ADMINISTRATIVAS PROTEGIDAS ===
  @Get('admin/noticias')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.noticiasService.findAllAdmin(paginationDto);
  }

  @Get('admin/noticias/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findOneAdmin(@Param('id') id: string) {
    return this.noticiasService.findOne(id);
  }

  @Post('admin/noticias')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  create(
    @Body() createNoticiaDto: CreateNoticiaDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.noticiasService.create(createNoticiaDto, user.id);
  }

  @Patch('admin/noticias/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() updateNoticiaDto: UpdateNoticiaDto) {
    return this.noticiasService.update(id, updateNoticiaDto);
  }

  @Delete('admin/noticias/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  remove(@Param('id') id: string) {
    return this.noticiasService.remove(id);
  }
}

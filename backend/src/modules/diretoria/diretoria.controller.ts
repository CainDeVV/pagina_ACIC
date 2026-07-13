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
  @Get('diretoria')
  findAllPublic(@Query() paginationDto: PaginationDto) {
    return this.diretoriaService.findAllPublic(paginationDto);
  }

  // ROTAS ADMINISTRATIVAS
  @Get('admin/diretoria')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.diretoriaService.findAllAdmin(paginationDto);
  }

  @Get('admin/diretoria/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findOne(@Param('id') id: string) {
    return this.diretoriaService.findOne(id);
  }

  @Post('admin/diretoria')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() createDiretoriaDto: CreateDiretoriaDto) {
    return this.diretoriaService.create(createDiretoriaDto);
  }

  @Patch('admin/diretoria/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  update(
    @Param('id') id: string,
    @Body() updateDiretoriaDto: UpdateDiretoriaDto,
  ) {
    return this.diretoriaService.update(id, updateDiretoriaDto);
  }

  @Delete('admin/diretoria/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  remove(@Param('id') id: string) {
    return this.diretoriaService.remove(id);
  }
}

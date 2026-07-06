import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QuemSomosService } from './quem-somos.service';
import { CreateQuemSomosDto } from './dto/create-quem-somos.dto';
import { UpdateQuemSomosDto } from './dto/update-quem-somos.dto';
import { AdminAuth } from '../../common/decorators/admin-auth.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';

@ApiTags('Institucional')
@Controller()
export class QuemSomosController {
  constructor(private readonly quemSomosService: QuemSomosService) {}

  // ROTA PÚBLICA
  @Get('quem-somos')
  findAllPublic(@Query() paginationDto: PaginationDto) {
    return this.quemSomosService.findAllPublic(paginationDto);
  }

  // ROTA PÚBLICA: Busca flexível por ID ou por KEY (Ex: /api/quem-somos/cmec)
  @Get('quem-somos/:idOrKey')
  findOnePublic(@Param('idOrKey') idOrKey: string) {
    return this.quemSomosService.findOnePublic(idOrKey);
  }

  // ROTAS ADMINISTRATIVAS
  @Get('admin/quem-somos')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.quemSomosService.findAllAdmin(paginationDto);
  }

  @Get('admin/quem-somos/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findOneAdmin(@Param('id') id: string) {
    return this.quemSomosService.findOneAdmin(id);
  }

  @Post('admin/quem-somos')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() createQuemSomosDto: CreateQuemSomosDto) {
    return this.quemSomosService.create(createQuemSomosDto);
  }

  @Patch('admin/quem-somos/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() updateQuemSomosDto: UpdateQuemSomosDto) {
    return this.quemSomosService.update(id, updateQuemSomosDto);
  }

  @Delete('admin/quem-somos/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  remove(@Param('id') id: string) {
    return this.quemSomosService.remove(id);
  }
}
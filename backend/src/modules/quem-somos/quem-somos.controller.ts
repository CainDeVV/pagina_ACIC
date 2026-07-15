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
  @ApiOperation({ summary: 'Listar quem somos (Público)' })
  @ApiResponse({ status: 200, description: 'Lista de seções quem somos.' })
  @Get('quem-somos')
  findAllPublic(@Query() paginationDto: PaginationDto) {
    return this.quemSomosService.findAllPublic(paginationDto);
  }

  // ROTA PÚBLICA: Busca flexível por ID ou por KEY (Ex: /api/quem-somos/cmec)
  @ApiOperation({ summary: 'Buscar seção por ID ou chave' })
  @ApiResponse({ status: 200, description: 'Seção encontrada.' })
  @ApiResponse({ status: 404, description: 'Seção não encontrada.' })
  @Get('quem-somos/:idOrKey')
  findOnePublic(@Param('idOrKey') idOrKey: string) {
    return this.quemSomosService.findOnePublic(idOrKey);
  }

  // ROTAS ADMINISTRATIVAS
  @ApiOperation({ summary: 'Listar quem somos (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de seções.' })
  @Get('admin/quem-somos')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.quemSomosService.findAllAdmin(paginationDto);
  }

  @ApiOperation({ summary: 'Buscar seção por ID' })
  @ApiResponse({ status: 200, description: 'Seção encontrada.' })
  @ApiResponse({ status: 404, description: 'Seção não encontrada.' })
  @Get('admin/quem-somos/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findOneAdmin(@Param('id') id: string) {
    return this.quemSomosService.findOneAdmin(id);
  }

  @ApiOperation({ summary: 'Criar nova seção' })
  @ApiResponse({ status: 201, description: 'Seção criada com sucesso.' })
  @Post('admin/quem-somos')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() createQuemSomosDto: CreateQuemSomosDto) {
    return this.quemSomosService.create(createQuemSomosDto);
  }

  @ApiOperation({ summary: 'Atualizar seção' })
  @ApiResponse({ status: 200, description: 'Seção atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Seção não encontrada.' })
  @Patch('admin/quem-somos/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  update(
    @Param('id') id: string,
    @Body() updateQuemSomosDto: UpdateQuemSomosDto,
  ) {
    return this.quemSomosService.update(id, updateQuemSomosDto);
  }

  @ApiOperation({ summary: 'Remover seção' })
  @ApiResponse({ status: 200, description: 'Seção removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Seção não encontrada.' })
  @Delete('admin/quem-somos/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  remove(@Param('id') id: string) {
    return this.quemSomosService.remove(id);
  }
}

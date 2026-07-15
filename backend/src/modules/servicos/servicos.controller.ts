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
import { ServicosService } from './servicos.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { AdminAuth } from '../../common/decorators/admin-auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-user.interface';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';

@ApiTags('Servicos')
@Controller()
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  // === ROTAS PÚBLICAS ===
  @ApiOperation({ summary: 'Listar serviços (Público)' })
  @ApiResponse({ status: 200, description: 'Lista de serviços.' })
  @Get('servicos')
  findAllPublic(@Query() paginationDto: PaginationDto) {
    return this.servicosService.findAllPublic(paginationDto);
  }

  @ApiOperation({ summary: 'Buscar serviço por slug (Público)' })
  @ApiResponse({ status: 200, description: 'Serviço encontrado.' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado.' })
  @Get('servicos/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.servicosService.findBySlug(slug);
  }

  // === ROTAS ADMINISTRATIVAS PROTEGIDAS ===
  @ApiOperation({ summary: 'Listar todos os serviços (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de serviços.' })
  @Get('admin/servicos')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findAllAdmin(@Query() paginationDto: PaginationDto) {
    return this.servicosService.findAllAdmin(paginationDto);
  }

  @ApiOperation({ summary: 'Buscar serviço por ID' })
  @ApiResponse({ status: 200, description: 'Serviço encontrado.' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado.' })
  @Get('admin/servicos/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  findOneAdmin(@Param('id') id: string) {
    return this.servicosService.findOne(id);
  }

  @ApiOperation({ summary: 'Criar novo serviço' })
  @ApiResponse({ status: 201, description: 'Serviço criado com sucesso.' })
  @Post('admin/servicos')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  create(
    @Body() createServicoDto: CreateServicoDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.servicosService.create(createServicoDto, user.id);
  }

  @ApiOperation({ summary: 'Atualizar serviço' })
  @ApiResponse({ status: 200, description: 'Serviço atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado.' })
  @Patch('admin/servicos/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() updateServicoDto: UpdateServicoDto) {
    return this.servicosService.update(id, updateServicoDto);
  }

  @ApiOperation({ summary: 'Remover serviço' })
  @ApiResponse({ status: 200, description: 'Serviço removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado.' })
  @Delete('admin/servicos/:id')
  @AdminAuth(UserRole.ADMIN, UserRole.EDITOR)
  remove(@Param('id') id: string) {
    return this.servicosService.remove(id);
  }
}

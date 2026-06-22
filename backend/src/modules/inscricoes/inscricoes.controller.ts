import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InscricoesService } from './inscricoes.service';
import { CreateInscricaoDto } from './dto/create-inscricao.dto';
import { UpdateInscricaoDto } from './dto/update-inscricao.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Inscricoes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inscricoes')
export class InscricoesController {
  constructor(
    private readonly inscricoesService: InscricoesService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ASSOCIADO)
  @ApiOperation({ summary: 'Criar uma nova inscrição em evento' })
  create(@Body() createInscricaoDto: CreateInscricaoDto, @CurrentUser() user: any) {
    return this.inscricoesService.create(createInscricaoDto, user);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Listar todas as inscrições' })
  findAll() {
    return this.inscricoesService.findAll();
  }

  @Get('me')
  @Roles(UserRole.ASSOCIADO)
  @ApiOperation({ summary: 'Listar inscrições do associado logado' })
  async findMyInscricoes(@CurrentUser() user: any) {
    const associado = await this.prisma.associado.findUnique({ where: { userId: user.id } });
    if (!associado) {
      return [];
    }
    return this.inscricoesService.findByAssociadoId(associado.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.ASSOCIADO)
  @ApiOperation({ summary: 'Buscar inscrição por ID' })
  findOne(@Param('id') id: string) {
    return this.inscricoesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar uma inscrição (Apenas Admin)' })
  update(@Param('id') id: string, @Body() updateInscricaoDto: UpdateInscricaoDto) {
    return this.inscricoesService.update(id, updateInscricaoDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover uma inscrição' })
  remove(@Param('id') id: string) {
    return this.inscricoesService.remove(id);
  }
}

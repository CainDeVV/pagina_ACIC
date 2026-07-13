import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CertificadosService } from './certificados.service';
import { CreateCertificadoSolicitacaoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoSolicitacaoDto } from './dto/update-certificado.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/request-user.interface';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Certificados')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('certificados')
export class CertificadosController {
  constructor(
    private readonly certificadosService: CertificadosService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ASSOCIADO)
  @ApiOperation({ summary: 'Solicitar um novo certificado' })
  create(
    @Body() createCertificadoDto: CreateCertificadoSolicitacaoDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.certificadosService.create(createCertificadoDto, user);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Listar todas as solicitações de certificados' })
  findAll() {
    return this.certificadosService.findAll();
  }

  @Get('me')
  @Roles(UserRole.ASSOCIADO)
  @ApiOperation({
    summary: 'Listar solicitações de certificado do associado logado',
  })
  async findMyCertificados(@CurrentUser() user: JwtPayload) {
    const associado = await this.prisma.associado.findUnique({
      where: { userId: user.id },
    });
    if (!associado) {
      return [];
    }
    return this.certificadosService.findByAssociadoId(associado.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.ASSOCIADO)
  @ApiOperation({ summary: 'Buscar solicitação de certificado por ID' })
  findOne(@Param('id') id: string) {
    return this.certificadosService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Atualizar status ou arquivo do certificado (Apenas Admin)',
  })
  update(
    @Param('id') id: string,
    @Body() updateCertificadoDto: UpdateCertificadoSolicitacaoDto,
  ) {
    return this.certificadosService.update(id, updateCertificadoDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover uma solicitação de certificado' })
  remove(@Param('id') id: string) {
    return this.certificadosService.remove(id);
  }
}

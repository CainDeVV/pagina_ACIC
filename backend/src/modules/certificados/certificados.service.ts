import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCertificadoSolicitacaoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoSolicitacaoDto } from './dto/update-certificado.dto';
import { UserRole } from '@prisma/client';
import { JwtPayload } from '../../common/interfaces/request-user.interface';

@Injectable()
export class CertificadosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCertificadoDto: CreateCertificadoSolicitacaoDto,
    user: JwtPayload,
  ) {
    if (user.role === UserRole.ASSOCIADO) {
      const associado = await this.prisma.associado.findUnique({
        where: { userId: user.id },
      });
      if (!associado || associado.id !== createCertificadoDto.associadoId) {
        throw new ForbiddenException(
          'Você só pode solicitar certificados para sua própria empresa.',
        );
      }
    }

    const associado = await this.prisma.associado.findUnique({
      where: { id: createCertificadoDto.associadoId },
    });
    if (!associado) throw new NotFoundException('Associado não encontrado');

    if (createCertificadoDto.eventoId) {
      const evento = await this.prisma.evento.findUnique({
        where: { id: createCertificadoDto.eventoId },
      });
      if (!evento) throw new NotFoundException('Evento não encontrado');
    }

    return this.prisma.certificadoSolicitacao.create({
      data: createCertificadoDto,
    });
  }

  async findAll() {
    return this.prisma.certificadoSolicitacao.findMany({
      include: {
        associado: { select: { companyName: true, cnpj: true } },
        evento: { select: { title: true } },
      },
    });
  }

  async findOne(id: string) {
    const certificado = await this.prisma.certificadoSolicitacao.findUnique({
      where: { id },
      include: {
        associado: true,
        evento: true,
      },
    });
    if (!certificado)
      throw new NotFoundException('Solicitação de certificado não encontrada');
    return certificado;
  }

  async findByAssociadoId(associadoId: string) {
    return this.prisma.certificadoSolicitacao.findMany({
      where: { associadoId },
      include: {
        evento: true,
      },
    });
  }

  async update(
    id: string,
    updateCertificadoDto: UpdateCertificadoSolicitacaoDto,
  ) {
    await this.findOne(id);
    return this.prisma.certificadoSolicitacao.update({
      where: { id },
      data: {
        ...updateCertificadoDto,
        reviewedAt:
          updateCertificadoDto.status &&
          updateCertificadoDto.status !== 'PENDING'
            ? new Date()
            : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.certificadoSolicitacao.delete({
      where: { id },
    });
  }
}

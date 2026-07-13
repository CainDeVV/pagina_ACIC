import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInscricaoDto } from './dto/create-inscricao.dto';
import { UpdateInscricaoDto } from './dto/update-inscricao.dto';
import { UserRole } from '@prisma/client';
import { JwtPayload } from '../../common/interfaces/request-user.interface';

@Injectable()
export class InscricoesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInscricaoDto: CreateInscricaoDto, user: JwtPayload) {
    if (user.role === UserRole.ASSOCIADO) {
      const associado = await this.prisma.associado.findUnique({
        where: { userId: user.id },
      });
      if (!associado || associado.id !== createInscricaoDto.associadoId) {
        throw new ForbiddenException(
          'Você só pode inscrever sua própria empresa em eventos.',
        );
      }
    }

    const evento = await this.prisma.evento.findUnique({
      where: { id: createInscricaoDto.eventoId },
    });
    if (!evento) throw new NotFoundException('Evento não encontrado');

    const associado = await this.prisma.associado.findUnique({
      where: { id: createInscricaoDto.associadoId },
    });
    if (!associado) throw new NotFoundException('Associado não encontrado');

    const existingInscricao = await this.prisma.inscricaoEvento.findUnique({
      where: {
        eventoId_associadoId: {
          eventoId: createInscricaoDto.eventoId,
          associadoId: createInscricaoDto.associadoId,
        },
      },
    });
    if (existingInscricao)
      throw new ConflictException('Associado já inscrito neste evento');

    return this.prisma.inscricaoEvento.create({
      data: createInscricaoDto,
    });
  }

  async findAll() {
    return this.prisma.inscricaoEvento.findMany({
      include: {
        evento: { select: { title: true, startsAt: true } },
        associado: { select: { companyName: true, cnpj: true } },
      },
    });
  }

  async findOne(id: string) {
    const inscricao = await this.prisma.inscricaoEvento.findUnique({
      where: { id },
      include: {
        evento: true,
        associado: true,
      },
    });
    if (!inscricao) throw new NotFoundException('Inscrição não encontrada');
    return inscricao;
  }

  async findByAssociadoId(associadoId: string) {
    return this.prisma.inscricaoEvento.findMany({
      where: { associadoId },
      include: {
        evento: true,
      },
    });
  }

  async update(id: string, updateInscricaoDto: UpdateInscricaoDto) {
    await this.findOne(id);
    return this.prisma.inscricaoEvento.update({
      where: { id },
      data: updateInscricaoDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.inscricaoEvento.delete({
      where: { id },
    });
  }
}

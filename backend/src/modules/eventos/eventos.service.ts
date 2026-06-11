import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import slugify from 'slugify';

@Injectable()
export class EventosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEventoDto: CreateEventoDto, authorId?: string) {
    const slug = slugify(createEventoDto.title, { lower: true, strict: true });

    try {
      return await this.prisma.evento.create({
        data: {
          ...createEventoDto,
          slug,
          authorId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Já existe um evento cadastrado com este título.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.evento.findMany({
      orderBy: { startsAt: 'asc' }, // Ordenação natural pela agenda
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });
  }

  async findOne(idOrSlug: string) {
    const evento = await this.prisma.evento.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }
    return evento;
  }

  async update(id: string, updateEventoDto: UpdateEventoDto) {
    let slug: string | undefined;

    if (updateEventoDto.title) {
      slug = slugify(updateEventoDto.title, { lower: true, strict: true });
    }

    try {
      return await this.prisma.evento.update({
        where: { id },
        data: {
          ...updateEventoDto,
          ...(slug && { slug }),
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Evento não encontrado para atualização.');
      }
      if (error.code === 'P2002') {
        throw new ConflictException('A alteração de título gera um link (slug) que já está em uso.');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.evento.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Evento não encontrado para exclusão.');
      }
      throw error;
    }
  }
}
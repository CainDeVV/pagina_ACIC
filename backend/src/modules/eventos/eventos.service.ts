import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import slugify from 'slugify';

@Injectable()
export class EventosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEventoDto: CreateEventoDto, authorId?: string) {
    const slug = slugify(createEventoDto.title, { lower: true, strict: true });
    return await this.prisma.evento.create({
      data: { ...createEventoDto, slug, authorId },
    });
  }

  async findAll(pagination: PaginationDto) {
    const { page, limit } = pagination;
    const where = { status: 'PUBLISHED' as const };
    const [data, total] = await Promise.all([
      this.prisma.evento.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startsAt: 'asc' },
        include: { author: { select: { name: true, email: true } } },
      }),
      this.prisma.evento.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findAllAdmin(pagination: PaginationDto) {
    const { page, limit } = pagination;
    const [data, total] = await Promise.all([
      this.prisma.evento.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startsAt: 'asc' },
        include: { author: { select: { name: true, email: true } } },
      }),
      this.prisma.evento.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findBySlug(slug: string) {
    const evento = await this.prisma.evento.findUnique({
      where: { slug },
      include: { author: { select: { name: true, email: true } } },
    });
    if (!evento || evento.status !== 'PUBLISHED') {
      throw new NotFoundException('Evento não encontrado.');
    }
    return evento;
  }

  async findOne(id: string) {
    const evento = await this.prisma.evento.findUnique({
      where: { id },
      include: { author: { select: { name: true, email: true } } },
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
    return await this.prisma.evento.update({
      where: { id },
      data: {
        ...updateEventoDto,
        ...(slug && { slug }),
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.evento.delete({
      where: { id },
    });
  }
}
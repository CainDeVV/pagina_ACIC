import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class EventosService {
  private readonly logger = new Logger(EventosService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createEventoDto: CreateEventoDto, authorId: string) {
    this.logger.log(`Criando novo evento: ${createEventoDto.title}`);
    const slug = slugify(createEventoDto.title, { lower: true, strict: true });
    const { categoriasIds, ...data } = createEventoDto;

    return await this.prisma.evento.create({
      data: {
        ...data,
        slug,
        authorId,
        ...(categoriasIds &&
          categoriasIds.length > 0 && {
            categorias: {
              connect: categoriasIds.map((id) => ({ id })),
            },
          }),
      },
    });
  }

  async findAll(pagination: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      search,
      categoriasIds,
      upcomingOnly,
    } = pagination;
    const skip = (page - 1) * limit;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const where: Prisma.EventoWhereInput = {
      status: { not: 'DRAFT' as const },
      AND: [
        { OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }] },
        ...(upcomingOnly
          ? [
              {
                OR: [
                  { startsAt: { gte: new Date() } },
                  { endsAt: { gte: new Date() } },
                  {
                    AND: [{ endsAt: null }, { startsAt: { gte: todayStart } }],
                  },
                ],
              },
            ]
          : []),
        ...(search
          ? [
              {
                OR: [
                  { title: { contains: search, mode: 'insensitive' as const } },
                  {
                    location: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                  },
                ],
              },
            ]
          : []),
      ],
      ...(categoriasIds &&
        categoriasIds.length > 0 && {
          categorias: { some: { id: { in: categoriasIds } } },
        }),
    };

    const [data, total] = await Promise.all([
      this.prisma.evento.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: upcomingOnly ? { startsAt: 'asc' } : { createdAt: 'desc' },
        include: {
          author: { select: { name: true, email: true } },
          categorias: true,
        },
      }),
      this.prisma.evento.count({ where }),
    ]);
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findAllAdmin(pagination: PaginationDto) {
    const { page = 1, limit = 10, search, categoriasIds } = pagination;
    const skip = (page - 1) * limit;

    const where: Prisma.EventoWhereInput = {
      ...(search && {
        OR: [{ title: { contains: search, mode: 'insensitive' as const } }],
      }),
      ...(categoriasIds &&
        categoriasIds.length > 0 && {
          categorias: { some: { id: { in: categoriasIds } } },
        }),
    };

    const [data, total] = await Promise.all([
      this.prisma.evento.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { startsAt: 'desc' },
        include: {
          author: { select: { name: true, email: true } },
          categorias: true,
        },
      }),
      this.prisma.evento.count({ where }),
    ]);
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    const evento = await this.prisma.evento.findUnique({
      where: { slug },
      include: {
        author: { select: { name: true, email: true } },
        categorias: true,
      },
    });
    if (!evento || evento.status === 'DRAFT') {
      throw new NotFoundException('Evento não encontrado.');
    }
    if (evento.publishedAt && new Date(evento.publishedAt) > new Date()) {
      throw new NotFoundException('Evento não encontrado.');
    }
    return evento;
  }

  async findOne(id: string) {
    const evento = await this.prisma.evento.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, email: true } },
        categorias: true,
      },
    });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }
    return evento;
  }

  async update(id: string, updateEventoDto: UpdateEventoDto) {
    const { categoriasIds, ...data } = updateEventoDto;
    const dataToUpdate: Prisma.EventoUpdateInput = { ...data };

    if (data.title) {
      dataToUpdate.slug = slugify(data.title, { lower: true, strict: true });
    }

    if (categoriasIds !== undefined) {
      dataToUpdate.categorias = {
        set: categoriasIds.map((catId) => ({ id: catId })),
      };
    }

    return await this.prisma.evento.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: string) {
    return await this.prisma.evento.delete({
      where: { id },
    });
  }
}

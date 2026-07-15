import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PublishStatus, Prisma } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class NoticiasService {
  private readonly logger = new Logger(NoticiasService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createNoticiaDto: CreateNoticiaDto, authorId: string) {
    this.logger.log(`Criando nova notícia: ${createNoticiaDto.title}`);
    const slug = slugify(createNoticiaDto.title, { lower: true, strict: true });
    const { categoriasIds, ...data } = createNoticiaDto;

    return this.prisma.noticia.create({
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

  async findAllPublic(paginationDto: PaginationDto) {
    const { page = 1, limit = 9, search, categoriasIds } = paginationDto;
    const skip = (page - 1) * limit;

    const where: Prisma.NoticiaWhereInput = {
      status: PublishStatus.PUBLISHED,
      AND: [
        { OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }] },
        ...(search
          ? [
              {
                OR: [
                  { title: { contains: search, mode: 'insensitive' as const } },
                  {
                    summary: { contains: search, mode: 'insensitive' as const },
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
      this.prisma.noticia.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: [{ destaque: 'desc' }, { createdAt: 'desc' }],
        include: { author: { select: { name: true } }, categorias: true },
      }),
      this.prisma.noticia.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllAdmin(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search, categoriasIds } = paginationDto || {};
    const skip = (page - 1) * limit;

    const where: Prisma.NoticiaWhereInput = {
      ...(search && {
        OR: [{ title: { contains: search, mode: 'insensitive' as const } }],
      }),
      ...(categoriasIds &&
        categoriasIds.length > 0 && {
          categorias: { some: { id: { in: categoriasIds } } },
        }),
    };

    const [data, total] = await Promise.all([
      this.prisma.noticia.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { publishedAt: 'desc' },
        include: {
          author: { select: { name: true, email: true } },
          categorias: true,
        },
      }),
      this.prisma.noticia.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const noticia = await this.prisma.noticia.findUnique({
      where: { slug, status: PublishStatus.PUBLISHED },
      include: {
        author: { select: { name: true, email: true } },
        categorias: true,
      },
    });

    if (!noticia)
      throw new NotFoundException('Notícia não encontrada ou não publicada.');
    if (noticia.publishedAt && new Date(noticia.publishedAt) > new Date()) {
      throw new NotFoundException('Notícia não encontrada ou não publicada.');
    }
    return noticia;
  }

  async findOne(id: string) {
    const noticia = await this.prisma.noticia.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, email: true } },
        categorias: true,
      },
    });

    if (!noticia) throw new NotFoundException('Notícia não encontrada.');
    return noticia;
  }

  async update(id: string, updateNoticiaDto: UpdateNoticiaDto) {
    await this.findOne(id);

    const { categoriasIds, ...data } = updateNoticiaDto;
    const dataToUpdate: Prisma.NoticiaUpdateInput = { ...data };

    if (data.title) {
      dataToUpdate.slug = slugify(data.title, { lower: true, strict: true });
    }

    if (categoriasIds !== undefined) {
      dataToUpdate.categorias = {
        set: categoriasIds.map((catId) => ({ id: catId })),
      };
    }

    return this.prisma.noticia.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: string) {
    return await this.prisma.noticia.delete({
      where: { id },
    });
  }
}

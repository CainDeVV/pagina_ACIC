import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PublishStatus } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class NoticiasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNoticiaDto: CreateNoticiaDto, authorId?: string) {
    const slug = slugify(createNoticiaDto.title, { lower: true, strict: true });

    try {
      return await this.prisma.noticia.create({
        data: {
          ...createNoticiaDto,
          slug,
          authorId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Já existe uma notícia cadastrada com este título.');
      }
      throw error;
    }
  }

  async findAllPublic(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.noticia.findMany({
        where: { status: PublishStatus.PUBLISHED },
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: { select: { name: true, email: true } },
        },
      }),
      this.prisma.noticia.count({
        where: { status: PublishStatus.PUBLISHED },
      }),
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
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.noticia.findMany({
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: { select: { name: true, email: true } },
        },
      }),
      this.prisma.noticia.count(),
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
      },
    });

    if (!noticia) throw new NotFoundException('Notícia não encontrada ou não publicada.');
    return noticia;
  }

  async findOne(id: string) {
    const noticia = await this.prisma.noticia.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, email: true } },
      },
    });

    if (!noticia) throw new NotFoundException('Notícia não encontrada.');
    return noticia;
  }

  async update(id: string, updateNoticiaDto: UpdateNoticiaDto) {
    let slug: string | undefined;

    if (updateNoticiaDto.title) {
      slug = slugify(updateNoticiaDto.title, { lower: true, strict: true });
    }

    try {
      return await this.prisma.noticia.update({
        where: { id },
        data: {
          ...updateNoticiaDto,
          ...(slug && { slug }),
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Notícia não encontrada para atualização.');
      }
      if (error.code === 'P2002') {
        throw new ConflictException('A alteração de título gera um link (slug) que já está em uso.');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.noticia.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Notícia não encontrada para exclusão.');
      }
      throw error;
    }
  }
}

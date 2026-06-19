import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
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

  async findAll() {
    return this.prisma.noticia.findMany({
      orderBy: { publishedAt: 'desc' },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });
  }

  async findOne(idOrSlug: string) {
    const noticia = await this.prisma.noticia.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    if (!noticia) {
      throw new NotFoundException('Notícia não encontrada.');
    }
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

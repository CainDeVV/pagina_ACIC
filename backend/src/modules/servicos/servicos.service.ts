import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PublishStatus } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class ServicosService {
  private readonly logger = new Logger(ServicosService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createServicoDto: CreateServicoDto, authorId?: string) {
    this.logger.log(`Criando serviço: ${createServicoDto.title}`);
    const slug = slugify(createServicoDto.title, { lower: true, strict: true });

    return await this.prisma.servico.create({
      data: {
        ...createServicoDto,
        slug,
        authorId,
      },
    });
  }

  async findAllPublic(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.servico.findMany({
        where: { status: PublishStatus.PUBLISHED },
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
        include: {
          author: { select: { name: true, email: true } },
        },
      }),
      this.prisma.servico.count({
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
      this.prisma.servico.findMany({
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
        include: {
          author: { select: { name: true, email: true } },
        },
      }),
      this.prisma.servico.count(),
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
    const servico = await this.prisma.servico.findUnique({
      where: { slug, status: PublishStatus.PUBLISHED },
      include: {
        author: { select: { name: true, email: true } },
      },
    });

    if (!servico)
      throw new NotFoundException('Serviço não encontrado ou não publicado.');
    return servico;
  }

  async findOne(id: string) {
    const servico = await this.prisma.servico.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, email: true } },
      },
    });

    if (!servico) throw new NotFoundException('Serviço não encontrado.');
    return servico;
  }

  async update(id: string, updateServicoDto: UpdateServicoDto) {
    let slug: string | undefined;

    if (updateServicoDto.title) {
      slug = slugify(updateServicoDto.title, { lower: true, strict: true });
    }

    return await this.prisma.servico.update({
      where: { id },
      data: {
        ...updateServicoDto,
        ...(slug && { slug }),
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.servico.delete({
      where: { id },
    });
  }
}

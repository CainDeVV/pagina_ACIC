import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Prisma, PublishStatus } from '@prisma/client';

@Injectable()
export class SlidesService {
  private readonly logger = new Logger(SlidesService.name);

  constructor(private prisma: PrismaService) {}

  create(createSlideDto: CreateSlideDto, authorId?: string) {
    this.logger.log(`Criando slide: ${createSlideDto.title}`);
    return this.prisma.homeSlide.create({
      data: {
        ...createSlideDto,
        authorId,
      },
    });
  }

  async findAllPublic(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto || {};
    const skip = (page - 1) * limit;

    const where: Prisma.HomeSlideWhereInput = {
      status: PublishStatus.PUBLISHED,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { subtitle: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.homeSlide.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        include: {
          author: { select: { name: true, email: true } },
        },
      }),
      this.prisma.homeSlide.count({ where }),
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
    const { page = 1, limit = 10, search } = paginationDto || {};
    const skip = (page - 1) * limit;

    const where: Prisma.HomeSlideWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { subtitle: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.homeSlide.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        include: {
          author: { select: { name: true, email: true } },
        },
      }),
      this.prisma.homeSlide.count({ where }),
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

  async findOne(id: string) {
    const slide = await this.prisma.homeSlide.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });
    if (!slide) {
      throw new NotFoundException('Slide não encontrado.');
    }
    return slide;
  }

  async update(id: string, updateSlideDto: UpdateSlideDto) {
    await this.findOne(id);
    return await this.prisma.homeSlide.update({
      where: { id },
      data: updateSlideDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.homeSlide.delete({
      where: { id },
    });
  }
}

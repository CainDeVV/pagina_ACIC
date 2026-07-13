import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PublishStatus } from '@prisma/client';

@Injectable()
export class SlidesService {
  constructor(private prisma: PrismaService) {}

  create(createSlideDto: CreateSlideDto, authorId?: string) {
    return this.prisma.homeSlide.create({
      data: {
        ...createSlideDto,
        authorId,
      },
    });
  }

  async findAllPublic(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.homeSlide.findMany({
        where: { status: PublishStatus.PUBLISHED },
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
        include: {
          author: { select: { name: true, email: true } },
        },
      }),
      this.prisma.homeSlide.count({
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
      this.prisma.homeSlide.findMany({
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
        include: {
          author: { select: { name: true, email: true } },
        },
      }),
      this.prisma.homeSlide.count(),
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
    return await this.prisma.homeSlide.update({
      where: { id },
      data: updateSlideDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.homeSlide.delete({
      where: { id },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';

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

  findAll() {
    return this.prisma.homeSlide.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });
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
    try {
      return await this.prisma.homeSlide.update({
        where: { id },
        data: updateSlideDto,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Slide não encontrado.');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.homeSlide.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Slide não encontrado.');
      }
      throw error;
    }
  }
}
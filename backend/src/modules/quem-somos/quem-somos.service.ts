import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuemSomosDto } from './dto/create-quem-somos.dto';
import { UpdateQuemSomosDto } from './dto/update-quem-somos.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PublishStatus } from '@prisma/client';

@Injectable()
export class QuemSomosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuemSomosDto: CreateQuemSomosDto) {
    return await this.prisma.quemSomosSection.create({
      data: createQuemSomosDto,
    });
  }

  async findAllPublic(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;
    const where = { status: PublishStatus.PUBLISHED };

    const [data, total] = await Promise.all([
      this.prisma.quemSomosSection.findMany({
        where,
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.quemSomosSection.count({ where }),
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
      this.prisma.quemSomosSection.findMany({
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.quemSomosSection.count(),
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

  async findOnePublic(idOrKey: string) {
    const section = await this.prisma.quemSomosSection.findFirst({
      where: {
        AND: [
          { status: PublishStatus.PUBLISHED },
          { OR: [{ id: idOrKey }, { key: idOrKey }] }
        ]
      },
    });
    
    if (!section) {
      throw new NotFoundException('Seção não encontrada ou não publicada.');
    }
    return section;
  }

  async findOneAdmin(id: string) {
    const section = await this.prisma.quemSomosSection.findUnique({
      where: { id },
    });
    
    if (!section) {
      throw new NotFoundException('Seção não encontrada.');
    }
    return section;
  }

  async update(id: string, updateQuemSomosDto: UpdateQuemSomosDto) {
    return await this.prisma.quemSomosSection.update({
      where: { id },
      data: updateQuemSomosDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.quemSomosSection.delete({
      where: { id },
    });
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePatrocinadorDto } from './dto/create-patrocinador.dto';
import { UpdatePatrocinadorDto } from './dto/update-patrocinador.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PublishStatus } from '@prisma/client';

@Injectable()
export class PatrocinadoresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreatePatrocinadorDto) {
    return this.prisma.patrocinador.create({
      data: createDto,
    });
  }

  async findAllPublic(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.patrocinador.findMany({
        where: { status: PublishStatus.PUBLISHED },
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.patrocinador.count({
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
      this.prisma.patrocinador.findMany({
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.patrocinador.count(),
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
    const record = await this.prisma.patrocinador.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException('Patrocinador não encontrado');
    }
    return record;
  }

  async update(id: string, updateDto: UpdatePatrocinadorDto) {
    await this.findOne(id);
    return this.prisma.patrocinador.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.patrocinador.delete({ where: { id } });
  }
}

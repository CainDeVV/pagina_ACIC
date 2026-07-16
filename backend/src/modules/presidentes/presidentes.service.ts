import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePresidenteDto } from './dto/create-presidente.dto';
import { UpdatePresidenteDto } from './dto/update-presidente.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PresidentesService {
  private readonly logger = new Logger(PresidentesService.name);

  constructor(private prisma: PrismaService) {}

  create(createPresidenteDto: CreatePresidenteDto) {
    this.logger.log(`Criando novo presidente: ${createPresidenteDto.name}`);
    return this.prisma.presidente.create({
      data: createPresidenteDto,
    });
  }

  async findAllPublic(paginationDto: PaginationDto) {
    const { page = 1, limit = 100, search } = paginationDto || {};
    const skip = (page - 1) * limit;

    const where: Prisma.PresidenteWhereInput = {
      ...(search && {
        OR: [{ name: { contains: search, mode: 'insensitive' as const } }],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.presidente.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { termStart: 'desc' }],
      }),
      this.prisma.presidente.count({ where }),
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
    const { page = 1, limit = 100, search } = paginationDto || {};
    const skip = (page - 1) * limit;

    const where: Prisma.PresidenteWhereInput = {
      ...(search && {
        OR: [{ name: { contains: search, mode: 'insensitive' as const } }],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.presidente.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { termStart: 'desc' }],
      }),
      this.prisma.presidente.count({ where }),
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
    const presidente = await this.prisma.presidente.findUnique({
      where: { id },
    });
    if (!presidente) {
      throw new NotFoundException('Presidente não encontrado.');
    }
    return presidente;
  }

  async update(id: string, updatePresidenteDto: UpdatePresidenteDto) {
    await this.findOne(id);
    return this.prisma.presidente.update({
      where: { id },
      data: updatePresidenteDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.presidente.delete({
      where: { id },
    });
  }
}

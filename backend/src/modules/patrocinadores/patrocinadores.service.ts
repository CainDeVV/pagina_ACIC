import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePatrocinadorDto } from './dto/create-patrocinador.dto';
import { UpdatePatrocinadorDto } from './dto/update-patrocinador.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PublishStatus, Prisma } from '@prisma/client';

@Injectable()
export class PatrocinadoresService {
  private readonly logger = new Logger(PatrocinadoresService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreatePatrocinadorDto) {
    this.logger.log(`Criando novo patrocinador: ${createDto.name}`);
    return this.prisma.patrocinador.create({
      data: createDto,
    });
  }

  async findAllPublic(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto || {};
    const skip = (page - 1) * limit;

    const where: Prisma.PatrocinadorWhereInput = {
      status: PublishStatus.PUBLISHED,
      ...(search && {
        OR: [{ name: { contains: search, mode: 'insensitive' as const } }],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.patrocinador.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.patrocinador.count({ where }),
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

    const where: Prisma.PatrocinadorWhereInput = {
      ...(search && {
        OR: [{ name: { contains: search, mode: 'insensitive' as const } }],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.patrocinador.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.patrocinador.count({ where }),
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

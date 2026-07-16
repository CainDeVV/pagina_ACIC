import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDiretoriaDto } from './dto/create-diretoria.dto';
import { UpdateDiretoriaDto } from './dto/update-diretoria.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DiretoriaService {
  private readonly logger = new Logger(DiretoriaService.name);

  constructor(private readonly prisma: PrismaService) {}

  create(createDiretoriaDto: CreateDiretoriaDto) {
    this.logger.log('Criando novo diretor');
    return this.prisma.diretor.create({
      data: createDiretoriaDto,
    });
  }

  async findAllPublic(paginationDto: PaginationDto) {
    const { page = 1, limit = 100, search } = paginationDto || {};
    const skip = (page - 1) * limit;

    const where: Prisma.DiretorWhereInput = {
      ...(search && {
        OR: [{ name: { contains: search, mode: 'insensitive' as const } }],
      }),
    };

    const [diretores, total] = await Promise.all([
      this.prisma.diretor.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
      this.prisma.diretor.count({ where }),
    ]);

    const categoriasMap = new Map<
      string,
      { roleLabel: string; members: import('@prisma/client').Diretor[] }
    >();
    for (const diretor of diretores) {
      if (!categoriasMap.has(diretor.category)) {
        categoriasMap.set(diretor.category, {
          roleLabel: diretor.category,
          members: [],
        });
      }
      categoriasMap.get(diretor.category)!.members.push(diretor);
    }

    return {
      data: Array.from(categoriasMap.values()),
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

    const where: Prisma.DiretorWhereInput = {
      ...(search && {
        OR: [{ name: { contains: search, mode: 'insensitive' as const } }],
      }),
    };

    const [diretores, total] = await Promise.all([
      this.prisma.diretor.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
      this.prisma.diretor.count({ where }),
    ]);

    const categoriasMap = new Map<
      string,
      { roleLabel: string; members: import('@prisma/client').Diretor[] }
    >();
    for (const diretor of diretores) {
      if (!categoriasMap.has(diretor.category)) {
        categoriasMap.set(diretor.category, {
          roleLabel: diretor.category,
          members: [],
        });
      }
      categoriasMap.get(diretor.category)!.members.push(diretor);
    }

    return {
      data: Array.from(categoriasMap.values()),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const diretor = await this.prisma.diretor.findUnique({
      where: { id },
    });

    if (!diretor) {
      throw new NotFoundException('Diretor não encontrado.');
    }
    return diretor;
  }

  async update(id: string, updateDiretoriaDto: UpdateDiretoriaDto) {
    await this.findOne(id);
    return this.prisma.diretor.update({
      where: { id },
      data: updateDiretoriaDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.diretor.delete({
      where: { id },
    });
  }
}

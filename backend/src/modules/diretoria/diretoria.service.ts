import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDiretoriaDto } from './dto/create-diretoria.dto';
import { UpdateDiretoriaDto } from './dto/update-diretoria.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class DiretoriaService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDiretoriaDto: CreateDiretoriaDto) {
    return this.prisma.diretor.create({
      data: createDiretoriaDto,
    });
  }

  async findAllPublic(paginationDto: PaginationDto) {
    const { page = 1, limit = 100 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [diretores, total] = await Promise.all([
      this.prisma.diretor.findMany({
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.diretor.count(),
    ]);

    const categoriasMap = new Map<string, any>();
    for (const diretor of diretores) {
      if (!categoriasMap.has(diretor.category)) {
        categoriasMap.set(diretor.category, {
          roleLabel: diretor.category,
          members: [],
        });
      }
      categoriasMap.get(diretor.category).members.push(diretor);
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
    const { page = 1, limit = 100 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [diretores, total] = await Promise.all([
      this.prisma.diretor.findMany({
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.diretor.count(),
    ]);

    const categoriasMap = new Map<string, any>();
    for (const diretor of diretores) {
      if (!categoriasMap.has(diretor.category)) {
        categoriasMap.set(diretor.category, {
          roleLabel: diretor.category,
          members: [],
        });
      }
      categoriasMap.get(diretor.category).members.push(diretor);
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
    try {
      return await this.prisma.diretor.update({
        where: { id },
        data: updateDiretoriaDto,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Diretor não encontrado para atualização.');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.diretor.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Diretor não encontrado para exclusão.');
      }
      throw error;
    }
  }
}
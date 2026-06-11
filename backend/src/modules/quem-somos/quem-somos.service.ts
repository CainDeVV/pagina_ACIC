import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuemSomosDto } from './dto/create-quem-somos.dto';
import { UpdateQuemSomosDto } from './dto/update-quem-somos.dto';

@Injectable()
export class QuemSomosService {
  constructor(private prisma: PrismaService) {}

  async create(createQuemSomosDto: CreateQuemSomosDto) {
    try {
      return await this.prisma.quemSomosSection.create({
        data: createQuemSomosDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Uma seção com essa chave (key) já existe.');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.quemSomosSection.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const section = await this.prisma.quemSomosSection.findUnique({
      where: { id },
    });
    if (!section) {
      throw new NotFoundException('Seção não encontrada.');
    }
    return section;
  }

  async update(id: string, updateQuemSomosDto: UpdateQuemSomosDto) {
    try {
      return await this.prisma.quemSomosSection.update({
        where: { id },
        data: updateQuemSomosDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Seção não encontrada.');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.quemSomosSection.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Seção não encontrada.');
      }
      throw error;
    }
  }
}

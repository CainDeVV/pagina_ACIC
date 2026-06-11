import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePresidenteDto } from './dto/create-presidente.dto';
import { UpdatePresidenteDto } from './dto/update-presidente.dto';

@Injectable()
export class PresidentesService {
  constructor(private prisma: PrismaService) {}

  create(createPresidenteDto: CreatePresidenteDto) {
    return this.prisma.presidente.create({
      data: createPresidenteDto,
    });
  }

  findAll() {
    return this.prisma.presidente.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });
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
    try {
      return await this.prisma.presidente.update({
        where: { id },
        data: updatePresidenteDto,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Presidente não encontrado.');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.presidente.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Presidente não encontrado.');
      }
      throw error;
    }
  }
}
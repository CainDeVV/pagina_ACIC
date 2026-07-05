import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePatrocinadorDto } from './dto/create-patrocinador.dto';
import { UpdatePatrocinadorDto } from './dto/update-patrocinador.dto';

@Injectable()
export class PatrocinadoresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreatePatrocinadorDto) {
    return this.prisma.patrocinador.create({
      data: createDto,
    });
  }

  async findAll(activeOnly = false) {
    const where = activeOnly ? { status: 'PUBLISHED' as const } : {};
    return this.prisma.patrocinador.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
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

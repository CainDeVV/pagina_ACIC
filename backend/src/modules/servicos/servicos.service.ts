import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import slugify from 'slugify';

@Injectable()
export class ServicosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServicoDto: CreateServicoDto, authorId?: string) {
    const slug = slugify(createServicoDto.title, { lower: true, strict: true });

    try {
      return await this.prisma.servico.create({
        data: {
          ...createServicoDto,
          slug,
          authorId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Já existe um serviço cadastrado com este título.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.servico.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });
  }

  async findOne(idOrSlug: string) {
    const servico = await this.prisma.servico.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    if (!servico) {
      throw new NotFoundException('Serviço não encontrado.');
    }
    return servico;
  }

  async update(id: string, updateServicoDto: UpdateServicoDto) {
    let slug: string | undefined;

    if (updateServicoDto.title) {
      slug = slugify(updateServicoDto.title, { lower: true, strict: true });
    }

    try {
      return await this.prisma.servico.update({
        where: { id },
        data: {
          ...updateServicoDto,
          ...(slug && { slug }),
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Serviço não encontrado para atualização.');
      }
      if (error.code === 'P2002') {
        throw new ConflictException('A alteração de título gera um link (slug) que já está em uso.');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.servico.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Serviço não encontrado para exclusão.');
      }
      throw error;
    }
  }
}
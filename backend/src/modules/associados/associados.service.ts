import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAssociadoDto } from './dto/create-associado.dto';
import { UpdateAssociadoDto } from './dto/update-associado.dto';

@Injectable()
export class AssociadosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAssociadoDto: CreateAssociadoDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: createAssociadoDto.userId },
    });
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const existingAssociadoByCnpj = await this.prisma.associado.findUnique({
      where: { cnpj: createAssociadoDto.cnpj },
    });
    if (existingAssociadoByCnpj) {
      throw new ConflictException('Já existe um associado com este CNPJ');
    }

    const existingAssociadoByUser = await this.prisma.associado.findUnique({
      where: { userId: createAssociadoDto.userId },
    });
    if (existingAssociadoByUser) {
      throw new ConflictException('Este usuário já possui uma empresa associada');
    }

    return this.prisma.associado.create({
      data: createAssociadoDto,
    });
  }

  async findAll() {
    return this.prisma.associado.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const associado = await this.prisma.associado.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
    if (!associado) {
      throw new NotFoundException(`Associado com ID ${id} não encontrado`);
    }
    return associado;
  }

  async findByUserId(userId: string) {
    const associado = await this.prisma.associado.findUnique({
      where: { userId },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
    if (!associado) {
      throw new NotFoundException(`Associado não encontrado para o usuário com ID ${userId}`);
    }
    return associado;
  }

  async update(id: string, updateAssociadoDto: UpdateAssociadoDto) {
    await this.findOne(id); // Check existence
    return this.prisma.associado.update({
      where: { id },
      data: updateAssociadoDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check existence
    return this.prisma.associado.delete({
      where: { id },
    });
  }
}

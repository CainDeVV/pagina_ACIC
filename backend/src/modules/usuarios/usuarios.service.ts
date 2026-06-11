import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const { password, ...rest } = createUsuarioDto;
    
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      
      const user = await this.prisma.user.create({
        data: {
          ...rest,
          passwordHash,
        },
      });
      const { passwordHash: _, ...result } = user;
      return result;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('E-mail já cadastrado.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const { password, ...rest } = updateUsuarioDto;
    let dataToUpdate: any = { ...rest };

    if (password) {
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });
      const { passwordHash: _, ...result } = user;
      return result;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('E-mail já cadastrado.');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuário não encontrado.');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
      });
      const { passwordHash: _, ...result } = user;
      return result;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuário não encontrado.');
      }
      throw error;
    }
  }
}
import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const { password, ...rest } = createUsuarioDto;
    const passwordHash = await bcrypt.hash(password, 10);

    try {
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
        throw new ConflictException('Este e-mail já está em uso por outro usuário.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: {
        role: { in: [UserRole.ADMIN, UserRole.EDITOR] },
      },
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
    const userToUpdate = await this.findOne(id);
    const { password, ...rest } = updateUsuarioDto;
    
    // Anti-Lockout no Update (Prevenir que o único ADMIN seja desativado ou rebaixado)
    if (userToUpdate.role === UserRole.ADMIN) {
      const isTryingToDeactivate = rest.active === false;
      const isTryingToDemote = rest.role && rest.role !== UserRole.ADMIN;
      
      if (isTryingToDeactivate || isTryingToDemote) {
        const adminCount = await this.prisma.user.count({
          where: { role: UserRole.ADMIN, active: true },
        });
        
        // Se há apenas 1 admin ativo no sistema, e estamos tentando mexer nele
        if (adminCount <= 1) {
          throw new ForbiddenException('Não é possível desativar ou rebaixar o último administrador ativo do sistema.');
        }
      }
    }

    const dataToUpdate: import('@prisma/client').Prisma.UserUpdateInput = {
      ...rest,
    };

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
        throw new ConflictException('Este e-mail já está em uso por outro usuário.');
      }
      throw error;
    }
  }

  async remove(id: string) {
    // Busca o usuário a ser deletado
    const userToDelete = await this.findOne(id);

    // Anti-Lockout: Se for admin, verifica se não é o último
    if (userToDelete.role === UserRole.ADMIN) {
      const adminCount = await this.prisma.user.count({
        where: { role: UserRole.ADMIN },
      });
      
      if (adminCount <= 1) {
        throw new ForbiddenException('Não é possível deletar o último administrador do sistema.');
      }
    }

    const user = await this.prisma.user.delete({
      where: { id },
    });
    const { passwordHash: _, ...result } = user;
    return result;
  }
}

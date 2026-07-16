import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UserRole, Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const USER_SELECT: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  active: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    this.logger.log(`Criando usuário: ${createUsuarioDto.email}`);
    const { password, ...rest } = createUsuarioDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email: rest.email },
    });
    if (existingUser) {
      throw new ConflictException(
        'Este e-mail já está em uso por outro usuário.',
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        ...rest,
        passwordHash,
      },
      select: USER_SELECT,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: {
        role: { in: [UserRole.ADMIN, UserRole.EDITOR] },
      },
      orderBy: [{ name: 'asc' }, { createdAt: 'desc' }],
      select: USER_SELECT,
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const userToUpdate = await this.findOne(id);
    const { password, ...rest } = updateUsuarioDto;

    if (rest.email && rest.email !== userToUpdate.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: rest.email },
      });
      if (existingUser) {
        throw new ConflictException(
          'Este e-mail já está em uso por outro usuário.',
        );
      }
    }

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
          throw new ForbiddenException(
            'Não é possível desativar ou rebaixar o último administrador ativo do sistema.',
          );
        }
      }
    }

    const dataToUpdate: Prisma.UserUpdateInput = {
      ...rest,
    };

    if (password) {
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: USER_SELECT,
    });

    // Expurga sessões ativas se houver rebaixamento de cargo, inativação ou troca de senha
    if (
      password ||
      rest.active === false ||
      (rest.role && rest.role !== userToUpdate.role)
    ) {
      await this.prisma.session.deleteMany({
        where: { userId: id },
      });
      this.logger.log(
        `Todas as sessões ativas do usuário ${id} foram invalidadas por alteração crítica.`,
      );
    }

    return updatedUser;
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
        throw new ForbiddenException(
          'Não é possível deletar o último administrador do sistema.',
        );
      }
    }

    return this.prisma.user.delete({
      where: { id },
      select: USER_SELECT,
    });
  }
}

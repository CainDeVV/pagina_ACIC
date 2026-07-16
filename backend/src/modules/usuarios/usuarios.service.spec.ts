import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from '../../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import {
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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

describe('UsuariosService', () => {
  let service: UsuariosService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  describe('create', () => {
    it('deve estourar ConflictException se email já existir', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: '1' } as any);
      const dto = { name: 'A', email: 'a@a.com', password: '123' };
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('deve criar usuário e hashear senha', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: '1', name: 'A' } as any);

      const dto = { name: 'A', email: 'a@a.com', password: '123' };
      const result = await service.create(dto);

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'A',
            email: 'a@a.com',
            passwordHash: expect.any(String),
          }),
          select: USER_SELECT,
        }),
      );
      expect(result).toHaveProperty('id', '1');
    });
  });

  describe('findAll', () => {
    it('deve buscar todos com ordenação name e createdAt', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      await service.findAll();
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { role: { in: [UserRole.ADMIN, UserRole.EDITOR] } },
        orderBy: [{ name: 'asc' }, { createdAt: 'desc' }],
        select: USER_SELECT,
      });
    });
  });

  describe('findOne', () => {
    it('deve estourar NotFoundException se não existir', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('deve retornar usuario', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: '1' } as any);
      const result = await service.findOne('1');
      expect(result).toHaveProperty('id', '1');
    });
  });

  describe('update', () => {
    it('deve estourar ConflictException ao mudar email para um ja existente', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({
        id: '1',
        email: 'a@a.com',
      } as any); // findOne
      prisma.user.findUnique.mockResolvedValueOnce({
        id: '2',
        email: 'b@b.com',
      } as any); // findUnique inside update

      await expect(service.update('1', { email: 'b@b.com' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve estourar ForbiddenException ao tentar inativar o ultimo admin', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({
        id: '1',
        role: UserRole.ADMIN,
      } as any);
      prisma.user.count.mockResolvedValue(1); // só tem 1 admin

      await expect(service.update('1', { active: false })).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('deve atualizar, hashear nova senha e expurgar sessoes', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({
        id: '1',
        role: UserRole.EDITOR,
      } as any);
      prisma.user.update.mockResolvedValue({ id: '1' } as any);

      await service.update('1', { password: 'nova' });

      expect(prisma.user.update).toHaveBeenCalled();
      expect(prisma.session.deleteMany).toHaveBeenCalledWith({
        where: { userId: '1' },
      });
    });
  });

  describe('remove', () => {
    it('deve estourar ForbiddenException ao tentar apagar ultimo admin', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({
        id: '1',
        role: UserRole.ADMIN,
      } as any);
      prisma.user.count.mockResolvedValue(1);

      await expect(service.remove('1')).rejects.toThrow(ForbiddenException);
    });

    it('deve apagar se houver mais de 1 admin', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({
        id: '1',
        role: UserRole.ADMIN,
      } as any);
      prisma.user.count.mockResolvedValue(2);
      prisma.user.delete.mockResolvedValue({ id: '1' } as any);

      await service.remove('1');
      expect(prisma.user.delete).toHaveBeenCalled();
    });
  });
});

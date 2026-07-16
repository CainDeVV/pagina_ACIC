import { Test, TestingModule } from '@nestjs/testing';
import { PresidentesService } from './presidentes.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';

describe('PresidentesService', () => {
  let service: PresidentesService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PresidentesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PresidentesService>(PresidentesService);
  });

  describe('create', () => {
    it('deve criar um presidente', async () => {
      const dto = { name: 'João', termStart: 2020 };
      prisma.presidente.create.mockResolvedValue({ id: '1', ...dto } as any);

      const result = await service.create(dto);

      expect(prisma.presidente.create).toHaveBeenCalledWith({ data: dto });
      expect(result.id).toBe('1');
    });
  });

  describe('findAllPublic', () => {
    it('deve buscar e mapear presidentes, aplicando search', async () => {
      prisma.presidente.findMany.mockResolvedValue([]);
      prisma.presidente.count.mockResolvedValue(0);

      await service.findAllPublic({ page: 1, limit: 10, search: 'teste' });

      expect(prisma.presidente.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
          orderBy: [{ sortOrder: 'asc' }, { termStart: 'desc' }],
          where: expect.objectContaining({
            OR: [{ name: { contains: 'teste', mode: 'insensitive' } }],
          }),
        }),
      );
    });
  });

  describe('findAllAdmin', () => {
    it('deve buscar e mapear presidentes, aplicando search', async () => {
      prisma.presidente.findMany.mockResolvedValue([]);
      prisma.presidente.count.mockResolvedValue(0);

      await service.findAllAdmin({ page: 1, limit: 10, search: 'admin' });

      expect(prisma.presidente.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [{ name: { contains: 'admin', mode: 'insensitive' } }],
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar presidente', async () => {
      prisma.presidente.findUnique.mockResolvedValue({ id: '1' } as any);
      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });

    it('deve estourar NotFoundException se não achar', async () => {
      prisma.presidente.findUnique.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar presidente se ele existir', async () => {
      prisma.presidente.findUnique.mockResolvedValue({ id: '1' } as any);
      prisma.presidente.update.mockResolvedValue({
        id: '1',
        name: 'Novo',
      } as any);

      await service.update('1', { name: 'Novo' });

      expect(prisma.presidente.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Novo' },
      });
    });

    it('deve estourar NotFoundException se não achar', async () => {
      prisma.presidente.findUnique.mockResolvedValue(null);
      await expect(service.update('999', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover presidente se ele existir', async () => {
      prisma.presidente.findUnique.mockResolvedValue({ id: '1' } as any);
      prisma.presidente.delete.mockResolvedValue({ id: '1' } as any);

      await service.remove('1');

      expect(prisma.presidente.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('deve estourar NotFoundException se não achar', async () => {
      prisma.presidente.findUnique.mockResolvedValue(null);
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});

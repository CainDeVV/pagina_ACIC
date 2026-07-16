import { Test, TestingModule } from '@nestjs/testing';
import { PatrocinadoresService } from './patrocinadores.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { PublishStatus } from '@prisma/client';

describe('PatrocinadoresService', () => {
  let service: PatrocinadoresService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatrocinadoresService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PatrocinadoresService>(PatrocinadoresService);
  });

  describe('create', () => {
    it('deve criar um patrocinador', async () => {
      const dto = { name: 'ACIC', logoUrl: 'url' };
      prisma.patrocinador.create.mockResolvedValue({ id: '1', ...dto } as any);

      const result = await service.create(dto);

      expect(prisma.patrocinador.create).toHaveBeenCalledWith({ data: dto });
      expect(result.id).toBe('1');
    });
  });

  describe('findAllPublic', () => {
    it('deve buscar apenas patrocinadores PUBLISHED e aplicar search e ordenação secundária', async () => {
      prisma.patrocinador.findMany.mockResolvedValue([]);
      prisma.patrocinador.count.mockResolvedValue(0);

      await service.findAllPublic({ page: 2, limit: 5, search: 'teste' });

      expect(prisma.patrocinador.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
          where: expect.objectContaining({
            status: PublishStatus.PUBLISHED,
            OR: [{ name: { contains: 'teste', mode: 'insensitive' } }],
          }),
        }),
      );
    });
  });

  describe('findAllAdmin', () => {
    it('deve buscar todos os patrocinadores sem filtro de status e aplicar search', async () => {
      prisma.patrocinador.findMany.mockResolvedValue([]);
      prisma.patrocinador.count.mockResolvedValue(0);

      await service.findAllAdmin({
        page: 1,
        limit: 10,
        search: 'admin-search',
      });

      expect(prisma.patrocinador.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
          where: expect.objectContaining({
            OR: [{ name: { contains: 'admin-search', mode: 'insensitive' } }],
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar patrocinador', async () => {
      prisma.patrocinador.findUnique.mockResolvedValue({ id: '1' } as any);
      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });

    it('deve estourar NotFoundException se não achar', async () => {
      prisma.patrocinador.findUnique.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar patrocinador', async () => {
      prisma.patrocinador.findUnique.mockResolvedValue({ id: '1' } as any);
      prisma.patrocinador.update.mockResolvedValue({
        id: '1',
        name: 'Novo',
      } as any);

      await service.update('1', { name: 'Novo' });

      expect(prisma.patrocinador.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Novo' },
      });
    });

    it('deve estourar NotFoundException se não achar', async () => {
      prisma.patrocinador.findUnique.mockResolvedValue(null);
      await expect(service.update('999', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover patrocinador', async () => {
      prisma.patrocinador.findUnique.mockResolvedValue({ id: '1' } as any);
      prisma.patrocinador.delete.mockResolvedValue({ id: '1' } as any);

      await service.remove('1');
      expect(prisma.patrocinador.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('deve estourar NotFoundException se não achar', async () => {
      prisma.patrocinador.findUnique.mockResolvedValue(null);
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      expect(prisma.patrocinador.delete).not.toHaveBeenCalled();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SlidesService } from './slides.service';
import { PrismaService } from '../../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { PublishStatus } from '@prisma/client';

describe('SlidesService', () => {
  let service: SlidesService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SlidesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<SlidesService>(SlidesService);
  });

  describe('create', () => {
    it('deve criar um slide com authorId', async () => {
      const dto = { title: 'T1', imageUrl: 'url' };
      prisma.homeSlide.create.mockResolvedValue({ id: '1', ...dto } as any);

      const result = await service.create(dto, 'user1');

      expect(prisma.homeSlide.create).toHaveBeenCalledWith({
        data: { ...dto, authorId: 'user1' },
      });
      expect(result).toHaveProperty('id', '1');
    });
  });

  describe('findAllPublic', () => {
    it('deve buscar com filtro e ordenação dupla', async () => {
      prisma.homeSlide.findMany.mockResolvedValue([]);
      prisma.homeSlide.count.mockResolvedValue(0);

      await service.findAllPublic({ page: 1, limit: 10, search: 'teste' });

      expect(prisma.homeSlide.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: PublishStatus.PUBLISHED,
            OR: [
              { title: { contains: 'teste', mode: 'insensitive' } },
              { subtitle: { contains: 'teste', mode: 'insensitive' } },
            ],
          },
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        }),
      );
    });
  });

  describe('findAllAdmin', () => {
    it('deve buscar com filtro e ordenação dupla sem restrição de status', async () => {
      prisma.homeSlide.findMany.mockResolvedValue([]);
      prisma.homeSlide.count.mockResolvedValue(0);

      await service.findAllAdmin({ page: 1, limit: 10, search: 'teste' });

      expect(prisma.homeSlide.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { title: { contains: 'teste', mode: 'insensitive' } },
              { subtitle: { contains: 'teste', mode: 'insensitive' } },
            ],
          },
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        }),
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar o slide se existir', async () => {
      prisma.homeSlide.findUnique.mockResolvedValue({
        id: '1',
        title: 'T1',
      } as any);

      const result = await service.findOne('1');

      expect(result).toHaveProperty('id', '1');
      expect(prisma.homeSlide.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { author: { select: { name: true, email: true } } },
      });
    });

    it('deve estourar NotFoundException se não existir', async () => {
      prisma.homeSlide.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve estourar NotFoundException se slide não existir', async () => {
      prisma.homeSlide.findUnique.mockResolvedValue(null);
      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });

    it('deve atualizar o slide se existir', async () => {
      prisma.homeSlide.findUnique.mockResolvedValue({ id: '1' } as any);
      prisma.homeSlide.update.mockResolvedValue({
        id: '1',
        title: 'Novo',
      } as any);

      const result = await service.update('1', { title: 'Novo' });
      expect(prisma.homeSlide.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { title: 'Novo' },
      });
      expect(result).toHaveProperty('title', 'Novo');
    });
  });

  describe('remove', () => {
    it('deve estourar NotFoundException se slide não existir', async () => {
      prisma.homeSlide.findUnique.mockResolvedValue(null);
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });

    it('deve deletar o slide se existir', async () => {
      prisma.homeSlide.findUnique.mockResolvedValue({ id: '1' } as any);
      prisma.homeSlide.delete.mockResolvedValue({ id: '1' } as any);

      await service.remove('1');
      expect(prisma.homeSlide.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});

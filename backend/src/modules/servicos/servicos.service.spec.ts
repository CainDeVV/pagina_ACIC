import { Test, TestingModule } from '@nestjs/testing';
import { ServicosService } from './servicos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { PublishStatus } from '@prisma/client';

describe('ServicosService', () => {
  let service: ServicosService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicosService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ServicosService>(ServicosService);
  });

  describe('create', () => {
    it('deve gerar slug e atribuir autorId', async () => {
      const dto = { title: 'Teste de Serviço', description: {} as any };
      prisma.servico.create.mockResolvedValue({
        id: '1',
        slug: 'teste-de-servico',
      } as any);

      const result = await service.create(dto, 'user-123');

      expect(prisma.servico.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Teste de Serviço',
            slug: 'teste-de-servico',
            authorId: 'user-123',
          }),
        }),
      );
      expect(result.slug).toBe('teste-de-servico');
    });
  });

  describe('findAllPublic', () => {
    it('deve buscar publicamente filtrando DRAFTS, paginando e aplicando search', async () => {
      prisma.servico.findMany.mockResolvedValue([]);
      prisma.servico.count.mockResolvedValue(0);

      await service.findAllPublic({ page: 2, limit: 5, search: 'teste' });

      expect(prisma.servico.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
          where: expect.objectContaining({
            status: PublishStatus.PUBLISHED,
            OR: [{ title: { contains: 'teste', mode: 'insensitive' } }],
          }),
        }),
      );
    });
  });

  describe('findAllAdmin', () => {
    it('deve buscar tudo sem filtro de status e aplicar search', async () => {
      prisma.servico.findMany.mockResolvedValue([]);
      prisma.servico.count.mockResolvedValue(0);

      await service.findAllAdmin({
        page: 1,
        limit: 10,
        search: 'admin-search',
      });

      expect(prisma.servico.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
          where: expect.objectContaining({
            OR: [{ title: { contains: 'admin-search', mode: 'insensitive' } }],
          }),
        }),
      );
    });
  });

  describe('findBySlug', () => {
    it('deve retornar o serviço se for publicado', async () => {
      prisma.servico.findUnique.mockResolvedValue({
        id: '1',
        slug: 'teste',
      } as any);
      const result = await service.findBySlug('teste');
      expect(result.id).toBe('1');
    });

    it('deve estourar NotFoundException se não existir ou for draft', async () => {
      prisma.servico.findUnique.mockResolvedValue(null);
      await expect(service.findBySlug('teste')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar o serviço', async () => {
      prisma.servico.findUnique.mockResolvedValue({ id: '1' } as any);
      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });

    it('deve estourar NotFoundException se não existir', async () => {
      prisma.servico.findUnique.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar o slug se title for provido', async () => {
      prisma.servico.findUnique.mockResolvedValue({ id: '1' } as any);
      prisma.servico.update.mockResolvedValue({ slug: 'novo-titulo' } as any);

      await service.update('1', { title: 'Novo Titulo' });

      expect(prisma.servico.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ slug: 'novo-titulo' }),
        }),
      );
    });

    it('não deve atualizar slug se title não for provido', async () => {
      prisma.servico.findUnique.mockResolvedValue({ id: '1' } as any);
      prisma.servico.update.mockResolvedValue({ id: '1' } as any);

      await service.update('1', { summary: 'Apenas Resumo' });

      const callArgs = prisma.servico.update.mock.calls[0][0];
      expect(callArgs.data.slug).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('remove deve lançar NotFoundException se não existir', async () => {
      prisma.servico.findUnique.mockResolvedValue(null);
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      expect(prisma.servico.delete).not.toHaveBeenCalled();
    });

    it('remove deve apagar o registro com sucesso', async () => {
      prisma.servico.findUnique.mockResolvedValue({ id: '1' } as any);
      prisma.servico.delete.mockResolvedValue({ id: '1' } as any);

      await service.remove('1');
      expect(prisma.servico.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});

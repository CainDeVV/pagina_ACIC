import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasService } from './categorias.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

describe('CategoriasService', () => {
  let service: CategoriasService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CategoriasService>(CategoriasService);
  });

  describe('create', () => {
    it('deve criar uma categoria com o slug correto', async () => {
      const dto: CreateCategoriaDto = { name: 'Ação Social', active: true };

      prisma.categoria.create.mockResolvedValue({
        id: '1',
        name: dto.name,
        slug: 'acao-social',
        color: '#3B82F6',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(dto);

      expect(result.slug).toBe('acao-social');
      expect(prisma.categoria.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Ação Social',
          slug: 'acao-social',
        }),
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar uma categoria se o ID existir', async () => {
      const mockCat = {
        id: '1',
        name: 'Eventos',
        slug: 'eventos',
        color: '#000',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.categoria.findUnique.mockResolvedValue(mockCat);

      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });

    it('deve estourar NotFoundException se o ID não existir', async () => {
      prisma.categoria.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar metadados de paginação corretamente', async () => {
      prisma.categoria.findMany.mockResolvedValue([]);
      prisma.categoria.count.mockResolvedValue(0);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.data).toEqual([]);

      expect(prisma.categoria.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
        }),
      );
    });

    it('deve aplicar filtro de busca com mode insensitive', async () => {
      prisma.categoria.findMany.mockResolvedValue([]);
      prisma.categoria.count.mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 10, search: 'teste' });

      expect(prisma.categoria.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: { contains: 'teste', mode: 'insensitive' },
          }),
        }),
      );
    });
  });

  describe('findActive', () => {
    it('deve buscar apenas categorias com active true', async () => {
      prisma.categoria.findMany.mockResolvedValue([]);

      await service.findActive();

      expect(prisma.categoria.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { active: true },
          orderBy: { name: 'asc' },
        }),
      );
    });
  });

  describe('update', () => {
    it('deve atualizar e regerar o slug se o nome mudar', async () => {
      prisma.categoria.findUnique.mockResolvedValue({
        id: '1',
        name: 'Antigo',
        slug: 'antigo',
        color: '#000',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      prisma.categoria.update.mockResolvedValue({
        id: '1',
        name: 'Novo Nome',
        slug: 'novo-nome',
        color: '#000',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.update('1', { name: 'Novo Nome' });
      expect(result.slug).toBe('novo-nome');
      expect(prisma.categoria.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ slug: 'novo-nome' }),
        }),
      );
    });
  });

  describe('remove', () => {
    it('deve estourar NotFoundException se tentar deletar categoria inexistente', async () => {
      prisma.categoria.findUnique.mockResolvedValue(null);
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      expect(prisma.categoria.delete).not.toHaveBeenCalled();
    });

    it('deve deletar a categoria chamando o ID correto no Prisma', async () => {
      const mockCat = { id: '1' } as any;
      prisma.categoria.findUnique.mockResolvedValue(mockCat);
      prisma.categoria.delete.mockResolvedValue(mockCat);

      await service.remove('1');

      expect(prisma.categoria.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DiretoriaService } from './diretoria.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';

describe('DiretoriaService', () => {
  let service: DiretoriaService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiretoriaService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<DiretoriaService>(DiretoriaService);
  });

  describe('create', () => {
    it('deve criar um diretor', async () => {
      const dto = { name: 'João', role: 'Presidente', category: 'Presidência' };
      prisma.diretor.create.mockResolvedValue({ id: '1', ...dto } as any);

      const result = await service.create(dto);

      expect(prisma.diretor.create).toHaveBeenCalledWith({ data: dto });
      expect(result.id).toBe('1');
    });
  });

  describe('findAllPublic', () => {
    it('deve buscar e mapear diretores por categoria, aplicando search', async () => {
      const mockDiretores = [
        { id: '1', name: 'A', category: 'Cat1' },
        { id: '2', name: 'B', category: 'Cat1' },
        { id: '3', name: 'C', category: 'Cat2' },
      ];
      prisma.diretor.findMany.mockResolvedValue(mockDiretores as any);
      prisma.diretor.count.mockResolvedValue(3);

      const result = await service.findAllPublic({
        page: 1,
        limit: 10,
        search: 'teste',
      });

      expect(prisma.diretor.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          where: expect.objectContaining({
            OR: [{ name: { contains: 'teste', mode: 'insensitive' } }],
          }),
        }),
      );

      expect(result.data).toHaveLength(2);
      expect(result.data[0].roleLabel).toBe('Cat1');
      expect(result.data[0].members).toHaveLength(2);
      expect(result.data[1].roleLabel).toBe('Cat2');
      expect(result.data[1].members).toHaveLength(1);
    });
  });

  describe('findAllAdmin', () => {
    it('deve buscar e mapear diretores por categoria, aplicando search', async () => {
      const mockDiretores = [{ id: '1', name: 'A', category: 'Cat1' }];
      prisma.diretor.findMany.mockResolvedValue(mockDiretores as any);
      prisma.diretor.count.mockResolvedValue(1);

      const result = await service.findAllAdmin({
        page: 1,
        limit: 100,
        search: 'admin',
      });

      expect(prisma.diretor.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [{ name: { contains: 'admin', mode: 'insensitive' } }],
          }),
        }),
      );
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('deve retornar diretor', async () => {
      prisma.diretor.findUnique.mockResolvedValue({ id: '1' } as any);
      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });

    it('deve estourar NotFoundException se não achar', async () => {
      prisma.diretor.findUnique.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar diretor se ele existir', async () => {
      prisma.diretor.findUnique.mockResolvedValue({ id: '1' } as any);
      prisma.diretor.update.mockResolvedValue({ id: '1', name: 'Novo' } as any);

      await service.update('1', { name: 'Novo' });

      expect(prisma.diretor.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Novo' },
      });
    });

    it('deve estourar NotFoundException se não achar', async () => {
      prisma.diretor.findUnique.mockResolvedValue(null);
      await expect(service.update('999', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover diretor se ele existir', async () => {
      prisma.diretor.findUnique.mockResolvedValue({ id: '1' } as any);
      prisma.diretor.delete.mockResolvedValue({ id: '1' } as any);

      await service.remove('1');

      expect(prisma.diretor.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('deve estourar NotFoundException se não achar', async () => {
      prisma.diretor.findUnique.mockResolvedValue(null);
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});

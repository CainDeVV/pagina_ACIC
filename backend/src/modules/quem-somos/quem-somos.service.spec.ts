import { Test, TestingModule } from '@nestjs/testing';
import { QuemSomosService } from './quem-somos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { PublishStatus } from '@prisma/client';
import { CreateQuemSomosDto } from './dto/create-quem-somos.dto';
import { UpdateQuemSomosDto } from './dto/update-quem-somos.dto';

describe('QuemSomosService', () => {
  let service: QuemSomosService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuemSomosService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<QuemSomosService>(QuemSomosService);
  });

  describe('create', () => {
    it('deve repassar os dados de criação para o Prisma com sucesso (Caminho Feliz)', async () => {
      const dto: CreateQuemSomosDto = {
        key: 'institucional',
        title: 'Institucional',
        content: { blocks: [] },
        status: PublishStatus.PUBLISHED,
      };

      const mockResult = {
        id: '1',
        ...dto,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
      prisma.quemSomosSection.create.mockResolvedValueOnce(mockResult);

      const result = await service.create(dto);

      expect(prisma.quemSomosSection.create).toHaveBeenCalledWith({
        data: dto,
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAllPublic', () => {
    it('deve buscar publicamente ordenado e filtrando DRAFTS (Caminho Feliz)', async () => {
      prisma.quemSomosSection.findMany.mockResolvedValue([]);
      prisma.quemSomosSection.count.mockResolvedValue(0);

      await service.findAllPublic({ page: 1, limit: 10 });
      expect(prisma.quemSomosSection.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { sortOrder: 'asc' },
          where: expect.objectContaining({ status: PublishStatus.PUBLISHED }),
          skip: 0,
          take: 10,
        }),
      );
    });
  });

  describe('findAllAdmin', () => {
    it('deve buscar dados paginados sem filtrar status (Caminho Feliz)', async () => {
      prisma.quemSomosSection.findMany.mockResolvedValue([]);
      prisma.quemSomosSection.count.mockResolvedValue(0);

      await service.findAllAdmin({ page: 2, limit: 5 });
      expect(prisma.quemSomosSection.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { sortOrder: 'asc' },
          skip: 5,
          take: 5,
        }),
      );
      // Validando que a query NÃO possui where
      expect(prisma.quemSomosSection.findMany).not.toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.anything() }),
      );
    });
  });

  describe('findOnePublic', () => {
    it('deve lançar NotFoundException se a seção não existir ou não estiver publicada (Caminho Triste)', async () => {
      prisma.quemSomosSection.findFirst.mockResolvedValueOnce(null);

      await expect(service.findOnePublic('cmec')).rejects.toThrow(
        new NotFoundException('Seção não encontrada ou não publicada.'),
      );
    });

    it('deve realizar busca por ID ou chave e retornar o objeto (Caminho Feliz)', async () => {
      const mockResult = { id: '1', key: 'cmec', title: 'CMEC' } as any;
      prisma.quemSomosSection.findFirst.mockResolvedValueOnce(mockResult);

      const result = await service.findOnePublic('cmec');

      expect(prisma.quemSomosSection.findFirst).toHaveBeenCalledWith({
        where: {
          AND: [
            { status: PublishStatus.PUBLISHED },
            { OR: [{ id: 'cmec' }, { key: 'cmec' }] },
          ],
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOneAdmin', () => {
    it('deve lançar NotFoundException se a seção não existir (Caminho Triste)', async () => {
      prisma.quemSomosSection.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOneAdmin('999')).rejects.toThrow(
        new NotFoundException('Seção não encontrada.'),
      );
    });

    it('deve buscar estritamente por ID sem filtros adicionais e retornar o objeto (Caminho Feliz)', async () => {
      const mockResult = { id: '1', key: 'cmec', title: 'CMEC' } as any;
      prisma.quemSomosSection.findUnique.mockResolvedValueOnce(mockResult);

      const result = await service.findOneAdmin('1');

      expect(prisma.quemSomosSection.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('deve lançar NotFoundException se não existir', async () => {
      prisma.quemSomosSection.findUnique.mockResolvedValueOnce(null);
      await expect(service.update('999', {})).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.quemSomosSection.update).not.toHaveBeenCalled();
    });

    it('deve acionar findOneAdmin e depois realizar a atualização no Prisma (Caminho Feliz)', async () => {
      const existingRecord = { id: '1', key: 'cmec', title: 'CMEC' } as any;
      prisma.quemSomosSection.findUnique.mockResolvedValueOnce(existingRecord); // mock do findOneAdmin

      const updateDto: UpdateQuemSomosDto = { title: 'Novo Título' };
      prisma.quemSomosSection.update.mockResolvedValueOnce({
        ...existingRecord,
        ...updateDto,
      });

      await service.update('1', updateDto);

      expect(prisma.quemSomosSection.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
    });
  });

  describe('remove', () => {
    it('deve lançar NotFoundException se não existir', async () => {
      prisma.quemSomosSection.findUnique.mockResolvedValueOnce(null);
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      expect(prisma.quemSomosSection.delete).not.toHaveBeenCalled();
    });

    it('deve acionar findOneAdmin e depois deletar o registro no Prisma (Caminho Feliz)', async () => {
      const existingRecord = { id: '1', key: 'cmec', title: 'CMEC' } as any;
      prisma.quemSomosSection.findUnique.mockResolvedValueOnce(existingRecord); // mock do findOneAdmin

      prisma.quemSomosSection.delete.mockResolvedValueOnce(existingRecord);

      await service.remove('1');

      expect(prisma.quemSomosSection.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { EventosService } from './eventos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { EventStatus, Prisma } from '@prisma/client';

describe('EventosService', () => {
  let service: EventosService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [EventosService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<EventosService>(EventosService);
  });

  describe('create', () => {
    it('deve criar um evento com slug e conectar categorias', async () => {
      const dto: CreateEventoDto = {
        title: 'Festa da Uva',
        description: { blocks: [] },
        startsAt: new Date().toISOString(),
        categoriasIds: ['cat-1', 'cat-2'],
      };

      prisma.evento.create.mockResolvedValue({
        id: '1',
        title: dto.title,
        slug: 'festa-da-uva',
        description: dto.description,
        authorId: 'user-1',
        startsAt: new Date(dto.startsAt),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: EventStatus.DRAFT,
        destaque: false,
        location: null,
        endsAt: null,
        capacity: null,
        coverImage: null,
        coverImageCaption: null,
        showCoverImage: false,
        publishedAt: null,
      });

      const result = await service.create(dto, 'user-1');
      expect(result.slug).toBe('festa-da-uva');

      expect(prisma.evento.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'Festa da Uva',
          slug: 'festa-da-uva',
          authorId: 'user-1',
          categorias: {
            connect: [{ id: 'cat-1' }, { id: 'cat-2' }],
          },
        }),
      });
    });
  });

  describe('findAll', () => {
    it('deve usar lógica de upcomingOnly com expect.any(Date)', async () => {
      prisma.evento.findMany.mockResolvedValue([]);
      prisma.evento.count.mockResolvedValue(0);

      const result = await service.findAll({
        page: 1,
        limit: 10,
        upcomingOnly: true,
      });

      expect(result.meta.total).toBe(0);

      const expectedWhere: Prisma.EventoWhereInput = {
        status: { not: 'DRAFT' },
        AND: [
          {
            OR: [
              { publishedAt: null },
              { publishedAt: { lte: expect.any(Date) } },
            ],
          },
          {
            OR: [
              { startsAt: { gte: expect.any(Date) } },
              { endsAt: { gte: expect.any(Date) } },
              {
                AND: [
                  { endsAt: null },
                  { startsAt: { gte: expect.any(Date) } },
                ],
              },
            ],
          },
        ],
      };

      expect(prisma.evento.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expectedWhere,
          orderBy: { startsAt: 'asc' },
        }),
      );
    });
  });

  describe('findAllAdmin', () => {
    it('deve listar eventos irrestritos e aplicar paginação', async () => {
      prisma.evento.findMany.mockResolvedValue([]);
      prisma.evento.count.mockResolvedValue(0);

      const result = await service.findAllAdmin({ page: 2, limit: 5 });

      expect(result.meta.page).toBe(2);
      expect(prisma.evento.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
          orderBy: { startsAt: 'desc' },
        }),
      );
    });
  });

  describe('findBySlug', () => {
    it('deve estourar NotFoundException se for DRAFT', async () => {
      prisma.evento.findUnique.mockResolvedValue({
        id: '1',
        title: 'Teste',
        slug: 'teste',
        status: 'DRAFT',
        description: {},
        authorId: 'user',
        startsAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        destaque: false,
        location: null,
        endsAt: null,
        capacity: null,
        coverImage: null,
        coverImageCaption: null,
        showCoverImage: false,
        publishedAt: null,
      });
      await expect(service.findBySlug('teste')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve retornar se for PUBLISHED', async () => {
      const mockEvento = {
        id: '1',
        title: 'Teste',
        slug: 'teste',
        status: EventStatus.PUBLISHED,
        description: {},
        authorId: 'user',
        startsAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        destaque: false,
        location: null,
        endsAt: null,
        capacity: null,
        coverImage: null,
        coverImageCaption: null,
        showCoverImage: false,
        publishedAt: null,
      };
      prisma.evento.findUnique.mockResolvedValue(mockEvento);

      const result = await service.findBySlug('teste');
      expect(result.slug).toBe('teste');
    });
  });

  describe('findOne', () => {
    it('deve estourar NotFoundException se o ID não existir', async () => {
      prisma.evento.findUnique.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });

    it('deve retornar o evento caso exista', async () => {
      const mockResult = { id: '1', title: 'Teste' } as any;
      prisma.evento.findUnique.mockResolvedValue(mockResult);

      const result = await service.findOne('1');
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('deve usar SET para categoriasIds quando provido', async () => {
      prisma.evento.update.mockResolvedValue({} as any);

      await service.update('1', { categoriasIds: ['new-1'] });

      expect(prisma.evento.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            categorias: { set: [{ id: 'new-1' }] },
          }),
        }),
      );
    });

    it('NÃO deve tocar em categorias se categoriasIds for omitido', async () => {
      prisma.evento.update.mockResolvedValue({} as any);

      await service.update('1', { title: 'Apenas Titulo' });

      const callArgs = prisma.evento.update.mock.calls[0][0];
      expect(callArgs.data.categorias).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('deve chamar o delete atômico passando o ID', async () => {
      const mockResult = { id: '1' } as any;
      prisma.evento.delete.mockResolvedValue(mockResult);

      await service.remove('1');

      expect(prisma.evento.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
